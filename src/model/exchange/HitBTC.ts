import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class HitBTC extends Exchange {
    constructor() {
        super(ExchangeId.HitBTC,
            ApiAccessType.plane,
            `https://api.hitbtc.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/2/public/orderbook/`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true);
    }
}