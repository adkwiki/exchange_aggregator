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
    constructor(readonly exchange: Exchange, readonly currencyPair: ICurrencyPair) {
    }

    async crawl() {
        switch(this.exchange.apiAccessType) {
        case ApiAccessType.plane:
            return this.execute();
        case ApiAccessType.cloudflare:
            return this.executeBypassCloudflare();
        case ApiAccessType.askBidSplitInterface:
            return this.executeAskBidSplitInterface();
        default:
            throw new Error(`unknown ApiAccessType ${this.exchange.apiAccessType}`);
        }
    }

    private getAxiosClient() {
        return axios.create({
            baseURL: this.exchange.apiUrlBase,
            headers: {
              'Content-Type': 'application/json',
            },
            responseType: 'json'  
        });
    }

    private async execute(){
        const axiosClient = this.getAxiosClient();

        const orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this.exchange.getPairSymbol(this.currencyPair)}`;
        //console.log("orderbookUrl:" + orderbookUrl);

        const orderbookResponse = await axiosClient.get(orderbookUrl);
        //console.log("orderbookResponse:" + JSON.stringify(orderbookResponse.data));

        await this.sleep(500);

        let bridgePairJson = null;
        if (this.currencyPair.right != CurrencyId.BTC) {
            if (this.currencyPair.bridge === undefined) {
                throw new Error(`invalid pair ${this.exchange.exchangeId} ${this.currencyPair.left} ${this.currencyPair.right}`);
            }
            const bridgePair: ICurrencyPair = {left: this.currencyPair.bridge.left, right: this.currencyPair.bridge.right};
            const bridgePairUrl = `${this.exchange.apiUrlBridgePrice}${this.exchange.getPairSymbol(bridgePair)}`;
            const bridgePriceResponse = await axiosClient.get(bridgePairUrl);
            bridgePairJson = JSON.stringify(bridgePriceResponse.data);
        }

        return {
            exchangeId: this.exchange.exchangeId,
            currencyPair: this.currencyPair,
            orderbookJson: JSON.stringify(orderbookResponse.data),
            bridgePairJson: bridgePairJson};
    }

    private async executeAskBidSplitInterface(){
        // for P2PB2B
        const axiosClient = this.getAxiosClient();

        let results: IRawOrderBook[] = [];

        // buy
        let orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.buy)}${this.exchange.getPairSymbol(this.currencyPair)}`;
        const orderbookResponseBuy = await axiosClient.get(orderbookUrl);

        // sell
        orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.sell)}${this.exchange.getPairSymbol(this.currencyPair)}`;
        const orderbookResponseSell = await axiosClient.get(orderbookUrl);
        
        const meargedOrderbook = {
            buy: orderbookResponseBuy.data,
            sell: orderbookResponseSell.data,
        }

        return {
            exchangeId: this.exchange.exchangeId,
            currencyPair: this.currencyPair,
            orderbookJson: JSON.stringify(meargedOrderbook),
            bridgePairJson: null};
    }

    private async executeBypassCloudflare(){

        const orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this.exchange.getPairSymbol(this.currencyPair)}`;

        const options = {
            method: 'GET',
            uri: `${this.exchange.apiUrlBase}${orderbookUrl}`,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true
        }
        const oderbookResponse = await cloudscraper.get(options)
    
        return {
            exchangeId: this.exchange.exchangeId,
            currencyPair: this.currencyPair,
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