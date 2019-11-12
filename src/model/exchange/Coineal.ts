import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_Coineal {
    code: string;
    data: {
        tick: {
            asks: [string, number][];
            bids: [string, number][];
        }
    }
}

export class Coineal extends Exchange {

    constructor() {
        super(ExchangeId.Coineal,
            ApiAccessType.plane,
            "https://exchange-open-api.coineal.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/open/api/market_dept?type=step0&symbol="}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, false);
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_Coineal>jsonObject;
        if(originOrderBook.code !== "0") {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.tick.bids) {
            buyOrderBook.push(new Order(Number(order[0]), order[1]));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.tick.asks) {
            sellOrderBook.push(new Order(Number(order[0]), order[1]));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }
}