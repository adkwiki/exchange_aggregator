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

        // ignore broken order
        let originOrderBookBid = originOrderBook["order-book"].bid;
        let originOrderBookAsk = originOrderBook["order-book"].ask;

        let isBlokenBidSide = false;
        while (originOrderBookBid[0].order_amount < 0) {
            originOrderBookBid.shift();
            isBlokenBidSide = true;
        }
      
        let isBlokenAskSide = false;
        while (originOrderBookAsk[0].order_amount < 0) {
            originOrderBookAsk.shift();
            isBlokenAskSide = true;
        }
      
        while (originOrderBookAsk[0].price <= originOrderBookBid[0].price) {
          if (isBlokenBidSide) {
            originOrderBookBid.shift();
          }
          if (isBlokenAskSide) {
            originOrderBookAsk.shift();
          }
        }
            
        const buyOrderBook = [];
        for (const order of originOrderBookBid) {
            buyOrderBook.push(new Order(order.price, order.order_amount))
        }

        const sellOrderBook = [];
        for (const order of originOrderBookAsk) {
            sellOrderBook.push(new Order(order.price, order.order_amount))
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }
}