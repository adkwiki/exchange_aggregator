import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getSuccessOrderBook, Order } from "../OrderBook";

interface IOrdreBook_INDOEX {
    orderbook: [{
        ordertype: string;
        coins: string;
        cost: string;
    }]
}

export class INDOEX extends Exchange {
    constructor() {
        super(ExchangeId.INDOEX,
            ApiAccessType.plane,
            "https://api.indoex.io",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/getOrderBook/"}],
            null,
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "_");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_INDOEX>jsonObject;

        const buyOrderBook = [];
        const sellOrderBook = [];
        for (const order of originOrderBook.orderbook) {
            if (order.ordertype === "Buy Order") {
                buyOrderBook.push(new Order(Number(order.cost), Number(order.coins)));
            } else {
                sellOrderBook.push(new Order(Number(order.cost), Number(order.coins)));
            }
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

}