import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class P2PB2B extends Exchange {
    constructor() {
        super(ExchangeId.P2PB2B,
            ApiAccessType.askBidSplitInterface,
            "https://api.p2pb2b.io",
            [
                {orderBookUrlType: OrderBookUrlType.buy, url: "/api/v1/public/book?offset=0&limit=100&side=buy&market="},
                {orderBookUrlType: OrderBookUrlType.sell, url: "/api/v1/public/book?offset=0&limit=100&side=sell&market="}
            ],
            null,
            [{left: CurrencyId.ADK, right: CurrencyId.BTC}]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true, "_");
    }
}