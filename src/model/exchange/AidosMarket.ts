import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair } from "../enum/CurrencyId";

export class AidosMarket extends Exchange {

    constructor() {
        super(ExchangeId.AidosMarket,
            ApiAccessType.plane,
            "https://aidosmarket.com",
            [{orderBookUrlType: OrderBookUrlType.all, url: "/api/order-book"}],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return "";
    }
}