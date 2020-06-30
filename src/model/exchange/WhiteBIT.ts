import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getSuccessOrderBook, Order } from "../OrderBook";

interface IOrdreBook_WhiteBIT {
    result: {
        asks: [string, string][];
        bids: [string, string][];
    }
}

interface IBridgePrice_WhiteBIT {
    result: {
        last: string;
    }
}

export class WhiteBIT extends Exchange {
    constructor() {
        super(ExchangeId.WhiteBIT,
            ApiAccessType.plane,
            "https://whitebit.com/api",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/v2/public/depth/"}],
            "/v1/public/ticker?market=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.USD, bridge: {left: CurrencyId.BTC, right: CurrencyId.USD}},
                {left: CurrencyId.ADK, right: CurrencyId.EUR, bridge: {left: CurrencyId.BTC, right: CurrencyId.EUR}}
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "_");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_WhiteBIT>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook.result.bids) {
            buyOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.result.asks) {
            sellOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_WhiteBIT>jsonObject;
        return Number(originBridgePrice.result.last);
    }
}