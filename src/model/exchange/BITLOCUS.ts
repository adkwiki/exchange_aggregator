import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class BITLOCUS extends Exchange {
    constructor() {
        super(ExchangeId.BITLOCUS,
            ApiAccessType.plane,
            `https://api.bitlocus.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/order_book/`}],
            "/trade_history/",
            [{left: CurrencyId.ADK, right: CurrencyId.EUR, bridge: {left: CurrencyId.BTC, right: CurrencyId.EUR}}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return `${currencyPairFormat(currencyPair, true)}?limit=1`;
    }
}