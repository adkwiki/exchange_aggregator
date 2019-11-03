export enum CurrencyId {
    ADK = 1,
    BTC,
    ETH,
    USD,
    EUR,
    USDT
}

export interface ICurrencyPair {
    left: CurrencyId,
    right: CurrencyId
}
