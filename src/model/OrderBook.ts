import { ICurrencyPair } from "./enum/CurrencyId";
import { ExchangeId } from "./enum/ExchangeId";

export class Order {
    constructor(
        readonly price: number,
        readonly volume: number
    ) {}
}

export class OrderBook {
    constructor(
        readonly exchangeId: ExchangeId,
        readonly pair: ICurrencyPair,
        readonly success: boolean,
        readonly buy: Order[],
        readonly sell: Order[],
        readonly updated_at: Date
    ) {}

    isVoid(): boolean {
        if (this.buy.length != 0) {
            return false;
        } else if (this.sell.length != 0) {
            return false;
        }
        return true;
    }  
}

export function getErrorOrderBook(exchangeId: ExchangeId, pair: ICurrencyPair): OrderBook {
    return new OrderBook(
        exchangeId,
        pair,
        false,
        [],
        [],
        new Date());
}

export function getSuccessOrderBook(exchangeId: ExchangeId, pair: ICurrencyPair, buy: Order[], sell: Order[], updated_at?: Date): OrderBook {
    
    let updated_at_set;
    if (updated_at === undefined) {
        updated_at_set = new Date;
    } else {
        updated_at_set = updated_at;
    }
    
    return new OrderBook(
        exchangeId,
        pair,
        true,
        buy,
        sell,
        updated_at_set);
}