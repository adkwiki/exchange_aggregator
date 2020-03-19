export enum CurrencyId {
    ADK = 1,
    BTC,
    ETH,
    USD,
    EUR,
    USDT,
    USDX,
    DAI
}

export interface ICurrencyPair {
    readonly left: CurrencyId,
    readonly right: CurrencyId,
    readonly bridge?: {left: CurrencyId, right: CurrencyId}
}

export function currencyPairFormat(currencyPair: ICurrencyPair, isUpper: boolean , separator: string = "") {
    if (isUpper) {
        return `${CurrencyId[currencyPair.left]}${separator}${CurrencyId[currencyPair.right]}`;
    } else {
        return `${CurrencyId[currencyPair.left].toLowerCase()}${separator}${CurrencyId[currencyPair.right].toLowerCase()}`
    }

}