export enum CurrencyId {
    ADK = 1,
    BTC,
    ETH,
    USD,
    EUR
}

export interface ICurrencyPair {
    left: CurrencyId,
    right: CurrencyId
}
