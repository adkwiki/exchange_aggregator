import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, Order, getSuccessOrderBook, getErrorOrderBook } from "../OrderBook";

interface IOrdreBook_IDAX {
    code: number;
    asks: [string, string][];
    bids: [string, string][];
}

interface IBridgePrice_IDAX {
    code: number;
    ticker: [{
        last: string;
    }]
}

export class IDAX extends Exchange {
    constructor() {
        super(ExchangeId.IDAX,
            ApiAccessType.plane,
            `https://openapi.idax.pro`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/v2/depth?pair=`}],
            "/api/v2/ticker?pair=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}}
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "_");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_IDAX>jsonObject;
        if(originOrderBook.code !== 10000) {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.bids) {
            buyOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.asks) {
            sellOrderBook.push(new Order(Number(order[0]), Number(order[1])));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_IDAX>jsonObject;
        if(originBridgePrice.code !== 10000) {
            throw new Error("failed : getBridgePrice");
        }
        return Number(originBridgePrice.ticker[0].last);
    }
}