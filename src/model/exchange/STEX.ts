import { Exchange, OrderBookUrlType } from "../Exchange";
import { ExchangeId } from "../enum/ExchangeId";
import { ApiAccessType } from "../enum/ApiAccessType";
import { CurrencyId, ICurrencyPair } from "../enum/CurrencyId";

export class STEX extends Exchange {
    constructor() {
        super(ExchangeId.STEX,
            ApiAccessType.plane,
            `https://api3.stex.com`,
            [{orderBookUrlType: OrderBookUrlType.all, url: `/public/orderbook/`}],
            "/public/ticker/",
            [
                {left: CurrencyId.ADK, right: CurrencyId.BTC},
                {left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}},
                {left: CurrencyId.ADK, right: CurrencyId.USD, bridge: {left: CurrencyId.BTC, right: CurrencyId.USD}},
                {left: CurrencyId.ADK, right: CurrencyId.EUR, bridge: {left: CurrencyId.BTC, right: CurrencyId.EUR}}
            ]);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.BTC) {
            return "743";
        } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.ETH) {
            return "952";
        } else if (currencyPair.left === CurrencyId.ETH && currencyPair.right === CurrencyId.BTC) {
            return "2";
        } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.USD) {
            return "744";
        } else if (currencyPair.left === CurrencyId.BTC && currencyPair.right === CurrencyId.USD) {
            return "702";
        } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.EUR) {
            return "745";
        } else if (currencyPair.left === CurrencyId.BTC && currencyPair.right === CurrencyId.EUR) {
            return "703";
        } else {
            throw new Error(`stex unknown pair ${currencyPair.left}/${currencyPair.right}:`)
        }
    }
}