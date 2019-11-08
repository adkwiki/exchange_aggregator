import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class fatbtc extends Exchange {
    constructor() {
        super(ExchangeId.fatbtc,
            ApiAccessType.cloudflare,
            "https://www.fatbtc.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/m/depth/"}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true);
    }
}