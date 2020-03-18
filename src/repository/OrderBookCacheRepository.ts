import { ExchangeId } from "../model/enum/ExchangeId";
import { OrderBook } from "../model/OrderBook";
import { ICurrencyPair } from '../model/enum/CurrencyId';

export interface IOrderBookCache {
    readonly orderbook: OrderBook,
    readonly bridgePrice: number | null,
    readonly bridgeCoefficient: number | null
}

export class OrderBookCacheRepository {
    private static _instance: OrderBookCacheRepository;

    private constructor() {
        // initialize
        OrderBookCacheRepository._orderBookMap = new Map<string, IOrderBookCache>();
    }

    private static _orderBookMap: Map<string, IOrderBookCache>;

    public static get instance(): OrderBookCacheRepository {
        if (!this._instance) {
            //console.log("create OrderBookCacheRepository instance");
            this._instance = new OrderBookCacheRepository();
        }

        return this._instance;
    }

    public read(exchangeId: ExchangeId, currencyPair: ICurrencyPair, cacheLifeitme: number) {
        // dirty read
        const cache = OrderBookCacheRepository._orderBookMap.get(OrderBookCacheRepository.generateKey(exchangeId, currencyPair));
        if (cache === undefined) {
            // not exists cache
            //console.log(`not exists cache ${exchangeId}:${currencyPair.left}/${currencyPair.right}`);
            return null;
        }

        if (cache.orderbook.updated_at.getTime() < (new Date()).getTime() - cacheLifeitme * 1000) {
            // past cacheLifeitme sec, reject cache
            //console.log(`reject cache ${exchangeId}:${currencyPair.left}/${currencyPair.right}`);
            return null;
        }

        //console.log(`exists cache ${exchangeId}:${currencyPair.left}/${currencyPair.right}`)
        return cache;
    }

    public save(result: IOrderBookCache) {
        OrderBookCacheRepository._orderBookMap.set(OrderBookCacheRepository.generateKey(result.orderbook.exchangeId, result.orderbook.pair), result);
    }

    private static generateKey(exchangeId: ExchangeId, currencyPair: ICurrencyPair) {
        return `${exchangeId}_${currencyPair.left}_${currencyPair.right}`;
    }
}