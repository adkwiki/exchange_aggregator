import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";
import { OrderBook, Order, getSuccessOrderBook } from "../OrderBook";
import { URL_REPLACE_KEYWORD_PAIR_SYMBOL } from "../../external/orderbookCrawler";

interface IOrdreBook_BittrexGlobal {
    bid: [
        { quantity: string, rate: string }
    ];
    ask: [
        { quantity: string, rate: string }
    ];
}

export class BittrexGlobal extends Exchange {
    // API DOC
    // https://bittrex.github.io/api/v3

    constructor() {
        super(ExchangeId.BittrexGlobal,
            ApiAccessType.plane,
            `https://api.bittrex.com/v3`,
            [{ orderBookUrlType: OrderBookUrlType.all, url: `/markets/${URL_REPLACE_KEYWORD_PAIR_SYMBOL}/orderbook` }],
            null,
            [
                { left: CurrencyId.ADK, right: CurrencyId.BTC },
            ]);
    }

    getPairSymbol(pair: ICurrencyPair): string {
        return currencyPairFormat(pair, true, "-");
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {

        const originOrderBook = <IOrdreBook_BittrexGlobal>jsonObject;

        const buyOrderBook = [];
        for (const order of originOrderBook.bid) {
            buyOrderBook.push(new Order(Number(order.rate), Number(order.quantity)));
        }

        const sellOrderBook = [];
        for (const order of originOrderBook.ask) {
            sellOrderBook.push(new Order(Number(order.rate), Number(order.quantity)));
        }

        return getSuccessOrderBook(this.exchangeId, pair, buyOrderBook, sellOrderBook);
    }
}