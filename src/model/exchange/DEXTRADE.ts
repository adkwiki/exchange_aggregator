import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, getSuccessOrderBook, Order } from "../OrderBook";

interface IOrdreBook_DEXTRADE {
    status: boolean;
    data: {
        buy: [{
            volume: number;
            count: number;
            rate: string;
        }],
        sell: [{
            volume: number;
            count: number;
            rate: string;
        }]
    }
}

interface IBridgePrice_DEXTRADE {
    status: boolean;
    data: {
        last: number;
    }
}

export class DEXTRADE extends Exchange {
    constructor() {
        super(ExchangeId.DEXTRADE,
            ApiAccessType.plane,
            `https://api.dex-trade.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/v1/public/book?pair=`}],
            "/v1/public/ticker?pair=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}},
                {left: CurrencyId.ADK, right: CurrencyId.USDT, bridge: {left: CurrencyId.BTC, right: CurrencyId.USDT}}
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true);
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_DEXTRADE>jsonObject;
        if(originOrderBook.status !== true) {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.data.buy) {
            buyOrderBook.push(new Order(Number(order.rate), order.volume));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.data.sell) {
            sellOrderBook.push(new Order(Number(order.rate), order.volume));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_DEXTRADE>jsonObject;
        return Number(originBridgePrice.data.last);
    }

}