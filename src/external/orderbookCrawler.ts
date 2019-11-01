import { Exchange, ApiAccessType } from "../model/Exchange";
import axios from "axios"
var cloudscraper = require('cloudscraper');

import { ICurrencyPair, CurrencyId } from "../model/enum/CurrencyId";
import { ExchangeId } from "../model/enum/ExchangeId";

export interface IRawOrderBook {
    exchangeId: ExchangeId;
    currencyPair: ICurrencyPair;
    orderbookJson: string;
    bridgePairJson: string | null;
}

export class OrderbookCrawler {
    private _exchange: Exchange;
    constructor(exchange: Exchange) {
        this._exchange = exchange;
    }

    async crawl() {
        if (this._exchange.apiAccessType === ApiAccessType.plane) {
            this.execute()
        } else {
            this.executeForCloudflare()
        }
    }

    private async execute(){
        const axiosClient = axios.create({
            baseURL: this._exchange.apiUrlBase,
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'json'  
        });

        let results: IRawOrderBook[] = [];
        for (const currencyPair of this._exchange.currencyPairArray) {
            const orderbookUrl = `${this._exchange.apiUrlOrderbook}${this._exchange.getPairSymbol(currencyPair)}`;
            const oderbookResponse = await axiosClient.get(orderbookUrl);

            let bridgePairJson = null;
            if (currencyPair.right !== CurrencyId.BTC) {
                // need bridge
                const bridgePair: ICurrencyPair = {left:currencyPair.right, right: CurrencyId.BTC};
                const bridgePairUrl = `${this._exchange.apiUrlBridgePrice}${this._exchange.getPairSymbol(bridgePair)}`;
                const orderbookResponse = await axiosClient.get(bridgePairUrl);
                bridgePairJson = orderbookResponse.data;
            }

            results.push({
                exchangeId: this._exchange.exchangeId,
                currencyPair: currencyPair,
                orderbookJson: oderbookResponse.data,
                bridgePairJson: bridgePairJson})
        }
        return results;
    }

    private async executeForCloudflare(){

        let results: IRawOrderBook[] = [];
        for (const currencyPair of this._exchange.currencyPairArray) {
            const orderbookUrl = `${this._exchange.apiUrlOrderbook}${this._exchange.getPairSymbol(currencyPair)}`;

            const options = {
                method: 'GET',
                uri: `${this._exchange.apiUrlBase}${orderbookUrl}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                json: true
            }
            const oderbookResponse = await cloudscraper.get(options)

            results.push({
                exchangeId: this._exchange.exchangeId,
                currencyPair: currencyPair,
                orderbookJson: oderbookResponse,
                bridgePairJson: null})
                
        }
        return results;
    }
}