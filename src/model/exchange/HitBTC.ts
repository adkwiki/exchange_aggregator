import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_HitBTC {
    ask:[{
        price: string;
        size: string;
    }];
    bid:[{
        price: string;
        size: string;
    }];
    timestamp: string;
}

export class HitBTC extends Exchange {
    constructor() {
        super(ExchangeId.HitBTC,
            ApiAccessType.plane,
            `https://api.hitbtc.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/2/public/orderbook/`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true);
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_HitBTC>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook.bid) {
            buyOrderBook.push(new Order(Number(order.price), Number(order.size)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.ask) {
            sellOrderBook.push(new Order(Number(order.price), Number(order.size)));
        }

        const updated_at = new Date(originOrderBook.timestamp);

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook, updated_at);
    }
}