import { ExchangeId } from './enum/ExchangeId';
import { ICurrencyPair } from './enum/CurrencyId';
import { ApiAccessType } from './enum/ApiAccessType';
import { OrderBook } from './OrderBook';

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

    protected constructor(
        readonly exchangeId: ExchangeId,
        readonly apiAccessType: ApiAccessType,
        readonly apiUrlBase: string,
        readonly apiUrlOrderbook: IApiUrlOrderBook[],
        readonly apiUrlBridgePrice: string | null,
        readonly currencyPairArray: ICurrencyPair[],
        readonly apiCallInterval: number = 0,
        readonly cacheLifeitme: number = 10)
    {}

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

    getPairSymbol(pair: ICurrencyPair): string {
        throw new Error(`NEED OVERRIDE ${pair}`);
    }

    getNormalizationOrderBook(pair: ICurrencyPair, jsonObject: any): OrderBook {
        throw new Error(`NEED OVERRIDE ${pair}`);
    }

    getBridgePrice(jsonObject: any): number {
        throw new Error("NEED OVERRIDE");
    }
}