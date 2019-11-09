import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair } from "../enum/CurrencyId";
import { OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_AidosMarket {
    "order-book": {
        ask: [{
            price: number;
            order_amount: number;
        }];
        bid: [{
            price: number;
            order_amount: number;
        }]
    }
}

export class AidosMarket extends Exchange {

    constructor() {
        super(ExchangeId.AidosMarket,
            ApiAccessType.plane,
            "https://aidosmarket.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/api/order-book"}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return "";
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_AidosMarket>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook["order-book"].bid) {
            buyOrderBook.push(new Order(order.price, order.order_amount))
        }

        const sellOrderBook = [];
        for (const order of originOrderBook["order-book"].ask) {
            sellOrderBook.push(new Order(order.price, order.order_amount))
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }
}