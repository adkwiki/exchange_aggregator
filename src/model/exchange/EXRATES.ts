import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, getSuccessOrderBook, Order } from "../OrderBook";

interface IOrdreBook_EXRATES {
    SELL: [{
        amount: string;
        rate: string;
    }];
    BUY: [{
        amount: string;
        rate: string;
    }];
}

interface IBridgePrice_EXRATES {
    last: string;
}

export class EXRATES extends Exchange {
    constructor() {
        super(ExchangeId.EXRATES,
            ApiAccessType.plane,
            "https://api.exrates.me",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/openapi/v1/public/orderbook/"}],
            "/openapi/v1/public/ticker?currency_pair=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}}
            ],
            100,
            120);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, false, "_");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_EXRATES>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook.BUY) {
            buyOrderBook.push(new Order(Number(order.rate), Number(order.amount)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.SELL) {
            sellOrderBook.push(new Order(Number(order.rate), Number(order.amount)));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }

    getBridgePrice(jsonObject: any): number {
        const originBridgePrice = <IBridgePrice_EXRATES[]>jsonObject;
        return Number(originBridgePrice[0].last);
    }
}