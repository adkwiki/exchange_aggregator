import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

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
            ]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, false, "_");
    }
}