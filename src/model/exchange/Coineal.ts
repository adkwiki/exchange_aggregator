import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class Coineal extends Exchange {

    constructor() {
        super(ExchangeId.Coineal,
            ApiAccessType.plane,
            "https://exchange-open-api.coineal.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/open/api/market_dept?type=step0&symbol="}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, false);
    }
}