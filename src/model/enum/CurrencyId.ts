export enum CurrencyId {
    ADK = 1,
    BTC,
    ETH,
    USD,
    EUR,
    USDT
}

export interface ICurrencyPair {
    readonly left: CurrencyId,
    readonly right: CurrencyId,
    readonly bridge?: {left: CurrencyId, right: CurrencyId}
}
