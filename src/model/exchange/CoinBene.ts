import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_CoinBene {
    code: number;
    data: {
        asks: [string[]];
        bids: [string[]];
        timestamp: Date
    }
}

export class CoinBene extends Exchange {
    constructor() {
        super(ExchangeId.CoinBene,
            ApiAccessType.plane,
            `http://openapi-exchange.coinbene.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/exchange/v2/market/orderBook?depth=100&symbol=`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "%2F");;
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_CoinBene>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook.data.bids) {
            buyOrderBook.push(new Order(Number(order[0]), Number(order[1])))
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.asks) {
            sellOrderBook.push(new Order(Number(order[0]), Number(order[1])))
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }
}