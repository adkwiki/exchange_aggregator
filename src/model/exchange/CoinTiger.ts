import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class CoinTiger extends Exchange {
    constructor() {
        super(ExchangeId.CoinTiger,
            ApiAccessType.plane,
            `https://api.cointiger.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/exchange/trading/api/market/depth?api_key=${CoinTiger.getApiKey()}&type=step0&symbol=`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, false);
    }

    static getApiKey(): string {
        // TODO move to env & generate key
        return "100310001";
    }
}