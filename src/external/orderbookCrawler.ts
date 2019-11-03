import { Exchange, OrderBookUrlType } from "../model/Exchange";
import axios from "axios"
var cloudscraper = require('cloudscraper');

import { ICurrencyPair, CurrencyId } from "../model/enum/CurrencyId";
import { ExchangeId } from "../model/enum/ExchangeId";
import { ApiAccessType } from "../model/enum/ApiAccessType";

export interface IRawOrderBook {
    exchangeId: ExchangeId;
    currencyPair: ICurrencyPair;
    orderbookJson: string;
    bridgePairJson: string | null;
}

export class OrderbookCrawler {
    private _exchange: Exchange;
    private _currencyPair: ICurrencyPair;

    constructor(exchange: Exchange, currencyPair: ICurrencyPair) {
        this._exchange = exchange;
        this._currencyPair = currencyPair;
    }

    async crawl() {
        switch(this._exchange.apiAccessType) {
        case ApiAccessType.plane:
            return this.execute();
        case ApiAccessType.cloudflare:
            return this.executeBypassCloudflare();
        case ApiAccessType.askBidSplitInterface:
            return this.executeAskBidSplitInterface();
        default:
            throw new Error(`unknown ApiAccessType ${this._exchange.apiAccessType}`);
        }
    }

    private getAxiosClient() {
        return axios.create({
            baseURL: this._exchange.apiUrlBase,
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'json'  
        });
    }

    private async execute(){
        const axiosClient = this.getAxiosClient();

        const orderbookUrl = `${this._exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this._exchange.getPairSymbol(this._currencyPair)}`;
        //console.log("orderbookUrl:" + orderbookUrl);

        const orderbookResponse = await axiosClient.get(orderbookUrl);
        //console.log("orderbookResponse:" + JSON.stringify(orderbookResponse.data));

        await this.sleep(500);

        let bridgePairJson = null;
        if (this._currencyPair.right != CurrencyId.BTC) {
            // need bridge
            const bridgePair: ICurrencyPair = {left: this._currencyPair.right, right: CurrencyId.BTC};
            const bridgePairUrl = `${this._exchange.apiUrlBridgePrice}${this._exchange.getPairSymbol(bridgePair)}`;
            const bridgePriceResponse = await axiosClient.get(bridgePairUrl);
            bridgePairJson = JSON.stringify(bridgePriceResponse.data);
        }

        return {
            exchangeId: this._exchange.exchangeId,
            currencyPair: this._currencyPair,
            orderbookJson: JSON.stringify(orderbookResponse.data),
            bridgePairJson: bridgePairJson};
    }

    private async executeAskBidSplitInterface(){
        // for P2PB2B
        const axiosClient = this.getAxiosClient();

        let results: IRawOrderBook[] = [];

        // buy
        let orderbookUrl = `${this._exchange.getApiUrlOrderbook(OrderBookUrlType.buy)}${this._exchange.getPairSymbol(this._currencyPair)}`;
        const orderbookResponseBuy = await axiosClient.get(orderbookUrl);

        // sell
        orderbookUrl = `${this._exchange.getApiUrlOrderbook(OrderBookUrlType.sell)}${this._exchange.getPairSymbol(this._currencyPair)}`;
        const orderbookResponseSell = await axiosClient.get(orderbookUrl);
        
        const meargedOrderbook = {
            buy: orderbookResponseBuy.data,
            sell: orderbookResponseSell.data,
        }

        return {
            exchangeId: this._exchange.exchangeId,
            currencyPair: this._currencyPair,
            orderbookJson: JSON.stringify(meargedOrderbook),
            bridgePairJson: null};
    }

    private async executeBypassCloudflare(){

        const orderbookUrl = `${this._exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this._exchange.getPairSymbol(this._currencyPair)}`;

        const options = {
            method: 'GET',
            uri: `${this._exchange.apiUrlBase}${orderbookUrl}`,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true
        }
        const oderbookResponse = await cloudscraper.get(options)
    
        return {
            exchangeId: this._exchange.exchangeId,
            currencyPair: this._currencyPair,
            orderbookJson: JSON.stringify(oderbookResponse),
            bridgePairJson: null};
    }

    private sleep(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    
}