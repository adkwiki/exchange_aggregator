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
    private _exchangeId: ExchangeId;
    private _currencyPairArray: ICurrencyPair[];
    private _apiAccessType: ApiAccessType;
    private _apiUrlBase: string;
    private _apiUrlOrderbook: IApiUrlOrderBook[];
    private _apiUrlBridgePrice: string | null;
    private _pairSymbolFunction: (currencyPair: ICurrencyPair) => string;

    constructor(
        exchangeId: ExchangeId,
        apiAccessType: ApiAccessType,
        apiUrlBase: string,
        apiUrlOrderbook: IApiUrlOrderBook[],
        apiUrlBridgePrice: string | null,
        currencyPairArray: ICurrencyPair[],
        pairSymbolFunction: (currencyPair: ICurrencyPair) => string)
    {
        if (!ExchangeId.supportAggregate(exchangeId)) {
            throw Error("supportAggregate is false");
        }
        this._exchangeId = exchangeId;
        this._apiAccessType = apiAccessType;
        this._apiUrlBase = apiUrlBase;
        this._apiUrlOrderbook = apiUrlOrderbook;
        this._apiUrlBridgePrice = apiUrlBridgePrice;
        this._pairSymbolFunction = pairSymbolFunction;
        this._currencyPairArray = currencyPairArray;
    }

    get exchangeId(): ExchangeId {
        return this._exchangeId;
    }

    get apiAccessType(): ApiAccessType {
        return this._apiAccessType;
    }

    get exchangeName(): string {
        return ExchangeId[this._exchangeId];
    }

    get currencyPairArray(): ICurrencyPair[] | [] {
        return this._currencyPairArray;
    }

    get apiUrlBase(): string {
        return this._apiUrlBase;
    }

    /*
    get apiUrlOrderbook(): IApiUrlOrderBook[] {
        return this._apiUrlOrderbook;
    }*/

    getApiUrlOrderbook(orderBookUrlType: OrderBookUrlType): string {
        for (const apiTypeAndUrl of this._apiUrlOrderbook) {
            if (apiTypeAndUrl.orderBookUrlType === orderBookUrlType) {
                return apiTypeAndUrl.url;
            }
        }
        throw new Error(`unknown orderBookUrlType ${orderBookUrlType}`);
    }

    get apiUrlBridgePrice(): string | null {
        return this._apiUrlBridgePrice;
    }


    getPairSymbol(currencyPair: ICurrencyPair): string {
        return this._pairSymbolFunction(currencyPair);
    }
}