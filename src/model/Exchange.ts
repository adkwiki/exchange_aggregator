import { ExchangeId } from './enum/ExchangeId';
import { ICurrencyPair } from './enum/CurrencyId';
import { ApiAccessType } from './enum/ApiAccessType';

export enum OrderBookUrlType {
    all = 1,
    buy,
    sell
}

export interface IApiUrlOrderBook {
    orderBookUrlType: OrderBookUrlType;
    url: string;
}

export class Exchange {
    private _pairSymbolFunction: (currencyPair: ICurrencyPair) => string;

    constructor(
        readonly exchangeId: ExchangeId,
        readonly apiAccessType: ApiAccessType,
        readonly apiUrlBase: string,
        readonly apiUrlOrderbook: IApiUrlOrderBook[],
        readonly apiUrlBridgePrice: string | null,
        readonly currencyPairArray: ICurrencyPair[],
        pairSymbolFunction: (currencyPair: ICurrencyPair) => string)
    {
        this._pairSymbolFunction = pairSymbolFunction;
    }

    get exchangeName(): string {
        return ExchangeId[this.exchangeId];
    }

    getApiUrlOrderbook(orderBookUrlType: OrderBookUrlType): string {
        for (const apiTypeAndUrl of this.apiUrlOrderbook) {
            if (apiTypeAndUrl.orderBookUrlType === orderBookUrlType) {
                return apiTypeAndUrl.url;
            }
        }
        throw new Error(`unknown orderBookUrlType ${orderBookUrlType}`);
    }

    getPairSymbol(currencyPair: ICurrencyPair): string {
        return this._pairSymbolFunction(currencyPair);
    }
}