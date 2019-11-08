import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair, currencyPairFormat } from "../enum/CurrencyId";

export class DEXTRADE extends Exchange {
    constructor() {
        super(ExchangeId.DEXTRADE,
            ApiAccessType.plane,
            `https://api.dex-trade.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/v1/public/book?pair=`}],
            "/v1/public/ticker?pair=",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}},
                {left: CurrencyId.ADK, right: CurrencyId.USDT, bridge: {left: CurrencyId.BTC, right: CurrencyId.USDT}}
            ]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return currencyPairFormat(currencyPair, true);
    }
}