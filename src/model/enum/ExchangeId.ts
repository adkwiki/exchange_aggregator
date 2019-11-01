enum ExchangeId {
    AidosMarket = 1,
    Coineal,
    CoinTiger,
    EXRATES,
    HitBTC,
    IDAX,
    P2PB2B,
    STEX,
    CoinBene,
    fatbtc,
    DEXTRADE
}

namespace ExchangeId {
    export function supportAggregate(exchangeId: ExchangeId) {
        switch (exchangeId) {
            case ExchangeId.AidosMarket:
            case ExchangeId.IDAX:
            case ExchangeId.STEX:
            case ExchangeId.fatbtc:
                return false;
            default:
                return true;
        }
    }
}

export {ExchangeId};
