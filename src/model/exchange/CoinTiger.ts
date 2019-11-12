import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { getErrorOrderBook, OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_CoinTiger {
    code: string;
    data: {
        depth_data: {
            tick: {
                buys: [string, number][];
                asks: [string, number][];
            };
            ts: number;
        };
    }
}

export class CoinTiger extends Exchange {
    constructor() {
        super(ExchangeId.CoinTiger,
            ApiAccessType.plane,
            `https://api.cointiger.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/exchange/trading/api/market/depth?api_key=${CoinTiger.getApiKey()}&type=step0&symbol=`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, false);
    }

    static getApiKey(): string {
        // TODO move to env & generate key
        return "100310001";
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_CoinTiger>jsonObject;
        if(originOrderBook.code !== "0") {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.depth_data.tick.buys) {
            buyOrderBook.push(new Order(Number(order[0]), order[1]));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.depth_data.tick.asks) {
            sellOrderBook.push(new Order(Number(order[0]), order[1]));
        }

        const updated_at = new Date(originOrderBook.data.depth_data.ts);

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook, updated_at);
    }
}