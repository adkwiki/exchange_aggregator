import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_fatbtc {
    status: number;
    timestamp: number;
    bids: [number, number][];
    asks: [number, number][];
}

export class fatbtc extends Exchange {
    constructor() {
        super(ExchangeId.fatbtc,
            ApiAccessType.cloudflare,
            "https://www.fatbtc.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/m/depth/"}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true);
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_fatbtc>jsonObject;
        if(originOrderBook.status !== 1) {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.bids) {
            buyOrderBook.push(new Order(order[0], order[1]));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.asks) {
            sellOrderBook.push(new Order(order[0], order[1]));
        }

        const updated_at = new Date(originOrderBook.timestamp);

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook, updated_at);
    }
}