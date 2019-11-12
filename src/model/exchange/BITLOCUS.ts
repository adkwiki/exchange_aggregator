import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { getErrorOrderBook, OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_BITLOCUS {
    success: boolean;
    data: {
        bids: [{
            price: string;
            quantity: string;
        }],
        asks: [{
            price: string;
            quantity: string;
        }]
    }
}

interface IBridgePrice_BITLOCUS {
    success: boolean;
    trades: {
        rows: [{
            price: string
        }]
    }
}

export class BITLOCUS extends Exchange {
    // API DOC
    // https://api.bitlocus.com/#introduction

    constructor() {
        super(ExchangeId.BITLOCUS,
            ApiAccessType.plane,
            `https://api.bitlocus.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/order_book/`}],
            "/trade_history/",
            [{left: CurrencyId.ADK, right: CurrencyId.EUR, bridge: {left: CurrencyId.BTC, right: CurrencyId.EUR}}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return `${currencyPairFormat(pair, true)}`;
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_BITLOCUS>jsonObject;
        if(!originOrderBook.success) {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.bids) {
            buyOrderBook.push(new Order(Number(order.price), Number(order.quantity)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.asks) {
            sellOrderBook.push(new Order(Number(order.price), Number(order.quantity)));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_BITLOCUS>jsonObject;
        if(!originBridgePrice.success) {
            throw new Error("failed : getBridgePrice");
        }
        return Number(originBridgePrice.trades.rows[0].price);
    }
}