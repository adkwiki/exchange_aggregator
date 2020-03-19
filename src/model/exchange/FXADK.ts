import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getErrorOrderBook, getSuccessOrderBook, Order } from "../OrderBook";

interface IOrdreBook_FXADK {
    status: string;
    result: {
        buy_orders: [{
            amount: string;
            price: string;
        }],
        sell_orders: [{
            amount: string;
            price: string;
        }]
    }
}

/*
interface IBridgePrice_FXADK {
    status: boolean;
    data: {
        last: number;
    }
}
*/

export class FXADK extends Exchange {
    constructor() {
        super(ExchangeId.FXADK,
            ApiAccessType.plane,
            `http://fxadk.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/PairData/`}],
            null, // TODO not exists bridge pair
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                // TODO support other pair
                //{left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}},
                //{left: CurrencyId.ADK, right: CurrencyId.USDT, bridge: {left: CurrencyId.BTC, right: CurrencyId.USDT}}
                //{left: CurrencyId.ADK, right: CurrencyId.USDX, bridge: {left: CurrencyId.BTC, right: CurrencyId.USDX}}
                //{left: CurrencyId.ADK, right: CurrencyId.DAI, bridge: {left: CurrencyId.BTC, right: CurrencyId.DAI}}
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "_");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_FXADK>jsonObject;
        if(originOrderBook.status !== "success") {
            return getErrorOrderBook(this.exchangeId, pair);
        }

        const buyOrderBook = [];
        for (const order of originOrderBook.result.buy_orders) {
            buyOrderBook.push(new Order(Number(order.price), Number(order.amount)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.result.sell_orders) {
            sellOrderBook.push(new Order(Number(order.price), Number(order.amount)));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    // TODO IMPL bridge
    //getBridgePrice(jsonObject: any): number {
    //    const originBridgePrice = <IBridgePrice_DEXTRADE>jsonObject;
    //    return originBridgePrice.data.last;
    //}

}