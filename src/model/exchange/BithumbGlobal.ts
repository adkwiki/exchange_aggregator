import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { getErrorOrderBook, OrderBook, Order, getSuccessOrderBook } from "../OrderBook";

interface IOrdreBook_BithumbGlobal {
    code: string;
    data: {
        a: [
            [string, string]
        ];
        b: [
            [string, string]
        ];
    }
}

interface IBridgePrice_BithumbGlobal {
    code: string;
    data: {
        c: string;
    }
}

export class BithumbGlobal extends Exchange {
    // API DOC
    // https://github.com/bithumb-pro/bithumb.pro-official-api-docs/blob/master/rest-api.md

    constructor() {
        super(ExchangeId.BithumbGlobal,
            ApiAccessType.plane,
            `https://global-openapi.bithumb.pro/openapi/v1`,
            [{ orderBookUrlType: OrderBookUrlType.all, url: `/spot/orderBook` }],
            "/spot/ticker/",
            [
                { left: CurrencyId.ADK, right: CurrencyId.BTC },
                { left: CurrencyId.ADK, right: CurrencyId.USDT, bridge: { left: CurrencyId.BTC, right: CurrencyId.USDT } },
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, false, "-");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_BithumbGlobal>jsonObject;
        if (originOrderBook.code !== "0") {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.b) {
            buyOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.a) {
            sellOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_BithumbGlobal>jsonObject;
        if (originBridgePrice.code !== "0") {
            throw new Error("failed : getBridgePrice");
        }
        return Number(originBridgePrice.data.c);
    }
}