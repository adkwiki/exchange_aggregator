import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class CoinBene extends Exchange {
    constructor() {
        super(ExchangeId.CoinBene,
            ApiAccessType.plane,
            `http://openapi-exchange.coinbene.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/exchange/v2/market/orderBook?depth=100&symbol=`}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true, "%2F");;
    }
}