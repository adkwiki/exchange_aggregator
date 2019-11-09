import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair } from "../enum/CurrencyId";
import { getErrorOrderBook, OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_STEX {
    success: boolean;
    data: {
        ask: [{
            amount: string;
            price: string;
        }];
        bid: [{
            amount: string;
            price: string;
        }];
    }
}

interface IBridgePrice_STEX {
    success: boolean;
    data: {
        last: string;
        timestamp: number;
    }
}

export class STEX extends Exchange {
    // API DOC
    // https://apidocs.stex.com/

    constructor() {
        super(ExchangeId.STEX,
            ApiAccessType.plane,
            `https://api3.stex.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/public/orderbook/`}],
            "/public/ticker/",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}},
                {left: CurrencyId.ADK, right: CurrencyId.USD, bridge: {left: CurrencyId.BTC, right: CurrencyId.USD}},
                {left: CurrencyId.ADK, right: CurrencyId.EUR, bridge: {left: CurrencyId.BTC, right: CurrencyId.EUR}}
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        if (pair.left === CurrencyId.ADK && pair.right === CurrencyId.BTC) {
            return "743";
        } else if (pair.left === CurrencyId.ADK && pair.right === CurrencyId.ETH) {
            return "952";
        } else if (pair.left === CurrencyId.ETH && pair.right === CurrencyId.BTC) {
            return "2";
        } else if (pair.left === CurrencyId.ADK && pair.right === CurrencyId.USD) {
            return "744";
        } else if (pair.left === CurrencyId.BTC && pair.right === CurrencyId.USD) {
            return "702";
        } else if (pair.left === CurrencyId.ADK && pair.right === CurrencyId.EUR) {
            return "745";
        } else if (pair.left === CurrencyId.BTC && pair.right === CurrencyId.EUR) {
            return "703";
        } else {
            throw new Error(`stex unknown pair ${pair.left}/${pair.right}:`)
        }
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_STEX>jsonObject;
        if(!originOrderBook.success) {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.bid) {
            buyOrderBook.push(new Order(Number(order.price), Number(order.amount)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.ask) {
            sellOrderBook.push(new Order(Number(order.price), Number(order.amount)));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_STEX>jsonObject;
        if(!originBridgePrice.success) {
            throw new Error("failed : getBridgePrice");
        }
        return Number(originBridgePrice.data.last);
    }
}