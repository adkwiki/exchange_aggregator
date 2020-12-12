import { Exchange, OrderBookUrlType } from "../model/Exchange";
import axios from "axios"
var cloudscraper = require('cloudscraper');

import { ICurrencyPair, CurrencyId } from "../model/enum/CurrencyId";
import { ExchangeId } from "../model/enum/ExchangeId";
import { ApiAccessType } from "../model/enum/ApiAccessType";
import { P2PB2B } from "../model/exchange/P2PB2B";
import { getErrorOrderBook, getSuccessOrderBook, OrderBook } from "../model/OrderBook";
import { OrderBookCacheRepository } from "../repository/OrderBookCacheRepository";

export interface INormalizationOrderBook {
    exchangeId: ExchangeId;
    currencyPair: ICurrencyPair;
    orderbook: OrderBook;
    bridgePrice: number | null;
    bridgeCoefficient: number | null;
}

export const URL_REPLACE_KEYWORD_PAIR_SYMBOL = "{PairSymbol}";

export class OrderbookCrawler {
    constructor(readonly exchange: Exchange, readonly currencyPair: ICurrencyPair) {
    }

    async crawl() {
        switch (this.exchange.apiAccessType) {
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

    private generateResult(
        orderbook: OrderBook,
        bridgePrice: number | null,
        bridgeCoefficient: number | null): INormalizationOrderBook {
        return {
            exchangeId: this.exchange.exchangeId,
            currencyPair: this.currencyPair,
            orderbook: orderbook,
            bridgePrice: bridgePrice,
            bridgeCoefficient: bridgeCoefficient
        };
    }


    private async execute() {

        // check cache
        const cacheInstance = OrderBookCacheRepository.instance;
        const cache = cacheInstance.read(this.exchange.exchangeId, this.currencyPair, this.exchange.cacheLifeitme);
        if (cache !== null) {
            // return cache result
            return this.generateResult(cache.orderbook, cache.bridgePrice, cache.bridgeCoefficient);
        }

        const axiosClient = this.getAxiosClient();

        const orderbookBaseUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.all)}`;
        const pairSymbol = `${this.exchange.getPairSymbol(this.currencyPair)}`;

        // generate API URL
        let orderbookUrl;
        if (orderbookBaseUrl.indexOf(URL_REPLACE_KEYWORD_PAIR_SYMBOL) !== -1) {
            orderbookUrl = orderbookBaseUrl.replace(URL_REPLACE_KEYWORD_PAIR_SYMBOL, pairSymbol)
        } else {
            orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this.exchange.getPairSymbol(this.currencyPair)}`;
        }

        //console.log("orderbookUrl:" + orderbookUrl);

        let orderbookResponse;
        try {
            orderbookResponse = await axiosClient.get(orderbookUrl);
        } catch (error) {
            console.log(error);
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }
        //console.log("orderbookResponse:" + JSON.stringify(orderbookResponse.data));

        const orderbook = this.exchange.getNormalizationOrderBook(this.currencyPair, orderbookResponse.data);
        //console.log("orderBook:" + JSON.stringify(orderBook));
        if (orderbook.isVoid()) {
            cacheInstance.save({ orderbook: orderbook, bridgePrice: null, bridgeCoefficient: null })
            return this.generateResult(orderbook, null, null);
        }

        if (this.exchange.apiCallInterval !== 0) {
            await this.sleep(this.exchange.apiCallInterval);
        }

        let bridgeCoefficient = null;
        let bridgePrice = null;
        if (this.currencyPair.right != CurrencyId.BTC) {
            if (this.currencyPair.bridge === undefined) {
                throw new Error(`invalid pair ${this.exchange.exchangeId} ${this.currencyPair.left} ${this.currencyPair.right}`);
            }
            const bridgePair: ICurrencyPair = { left: this.currencyPair.bridge.left, right: this.currencyPair.bridge.right };
            const bridgePairUrl = `${this.exchange.apiUrlBridgePrice}${this.exchange.getPairSymbol(bridgePair)}`;

            let bridgePriceResponse;
            try {
                bridgePriceResponse = await axiosClient.get(bridgePairUrl);
            } catch (error) {
                console.log(error);
                return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
            }

            bridgePrice = this.exchange.getBridgePrice(bridgePriceResponse.data);

            if (this.currencyPair.bridge.left === CurrencyId.BTC) {
                // TODO toFix?
                bridgeCoefficient = 1 / bridgePrice;
            } else {
                bridgeCoefficient = bridgePrice;
            }
        }

        cacheInstance.save({ orderbook: orderbook, bridgePrice: bridgePrice, bridgeCoefficient: bridgeCoefficient })
        return this.generateResult(orderbook, bridgePrice, bridgeCoefficient);
    }

    private async executeAskBidSplitInterface() {
        // for P2PB2B
        const axiosClient = this.getAxiosClient();

        // buy
        let orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.buy)}${this.exchange.getPairSymbol(this.currencyPair)}`;
        let orderbookResponseBuy;
        try {
            orderbookResponseBuy = await axiosClient.get(orderbookUrl);
        } catch (error) {
            console.log(error);
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }

        const orderbookBuy = (<P2PB2B>this.exchange).getNormalizationOrderBookAskBidSplit(orderbookResponseBuy.data);
        if (orderbookBuy === null) {
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }

        // sell
        orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.sell)}${this.exchange.getPairSymbol(this.currencyPair)}`;

        let orderbookResponseSell;
        try {
            orderbookResponseSell = await axiosClient.get(orderbookUrl);
        } catch (error) {
            console.log(error);
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }

        const orderbookSell = (<P2PB2B>this.exchange).getNormalizationOrderBookAskBidSplit(orderbookResponseSell.data);
        if (orderbookSell === null) {
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }

        const meargedOrderbook = getSuccessOrderBook(this.exchange.exchangeId, this.currencyPair, orderbookBuy, orderbookSell);

        return this.generateResult(meargedOrderbook, null, null);
    }

    private async executeBypassCloudflare() {

        const orderbookUrl = `${this.exchange.getApiUrlOrderbook(OrderBookUrlType.all)}${this.exchange.getPairSymbol(this.currencyPair)}`;

        const options = {
            method: 'GET',
            uri: `${this.exchange.apiUrlBase}${orderbookUrl}`,
            headers: {
                'Content-Type': 'application/json',
            },
            json: true
        }

        let orderbookResponse;
        try {
            orderbookResponse = await cloudscraper.get(options);
        } catch (error) {
            console.log(error);
            return this.generateResult(getErrorOrderBook(this.exchange.exchangeId, this.currencyPair), null, null);
        }

        const orderbook = this.exchange.getNormalizationOrderBook(this.currencyPair, orderbookResponse);

        return this.generateResult(orderbook, null, null);
    }

    private sleep(time: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

}