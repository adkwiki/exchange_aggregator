import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class IDAX extends Exchange {
    constructor() {
        super(ExchangeId.IDAX,
            ApiAccessType.plane,
            `https://openapi.idax.pro`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/api/v2/depth?pair=`}],
            "/api/v2/ticker?pair=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}}
            ]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true, "_");
    }
}