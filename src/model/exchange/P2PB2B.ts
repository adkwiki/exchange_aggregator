import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, Order } from "../OrderBook";

interface IOrdreBook_P2PB2B {
    success: boolean;
    result: {
        orders: [{
            price: string;
            amount: string;
        }];
    };
}

export class P2PB2B extends Exchange {
    constructor() {
        super(ExchangeId.P2PB2B,
            ApiAccessType.askBidSplitInterface,
            "https://api.p2pb2b.io",
            [
                {orderBookUrlType: OrderBookUrlType.buy, url: "/api/v1/public/book?offset=0&limit=100&side=buy&market="},
                {orderBookUrlType: OrderBookUrlType.sell, url: "/api/v1/public/book?offset=0&limit=100&side=sell&market="}
            ],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "_");
    }

    getNormalizationOrderBookAskBidSplit(jsonObject: any): Order[] | null {

        const originOrderBook = <IOrdreBook_P2PB2B>jsonObject;
        if(!originOrderBook.success) {
            return null;
        }

        const orderBook: Order[] = [];
        let beforeOrder = null;
        for (const order of originOrderBook.result.orders) {
            const price = Number(order.price);
            const amount = Number(order.amount);

            if (beforeOrder === null) {
                // top order
                beforeOrder = new Order(price, amount);
            } else if (beforeOrder.price === price) {
                // same price order
                beforeOrder = new Order(price, beforeOrder.volume + amount);
            } else {
                // switch price
                orderBook.push(beforeOrder);
                beforeOrder = new Order(price, amount);
            }
        }

        if (beforeOrder !== null) {
            orderBook.push(beforeOrder);
        }

        return orderBook;
    }
}