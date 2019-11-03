import { Exchange, OrderBookUrlType } from "../model/Exchange";
import { ExchangeId } from '../model/enum/ExchangeId';
import { CurrencyId, ICurrencyPair } from '../model/enum/CurrencyId';
import { ApiAccessType } from "../model/enum/ApiAccessType";

export class ExchangeRepository {

  private static _instance: ExchangeRepository;

  private _exchangeArray : Exchange[]; 

  // convert functions TODO refactor
  private lowerCaseSymbolFunctionWithDelimitaUS = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left].toLowerCase()}_${CurrencyId[currencyPair.right].toLowerCase()}`;
  };

  private lowerCaseSymbolFunction = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left].toLowerCase()}${CurrencyId[currencyPair.right].toLowerCase()}`;
  };

  private upperCaseSymbolFunctionWithDelimitaUS  = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left]}_${CurrencyId[currencyPair.right]}`;
  };

  private upperCaseSymbolFunctionWithDelimitaSL  = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left]}%2F${CurrencyId[currencyPair.right]}`;
  };

  private upperCaseSymbolFunction = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left]}${CurrencyId[currencyPair.right]}`;
  };

  private constructor() {
    this._exchangeArray = [];
    let exchange;
    let currencyArray: ICurrencyPair[];

    // Coineal
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.Coineal,
        ApiAccessType.plane,
        "https://exchange-open-api.coineal.com",
        [{orderBookUrlType: OrderBookUrlType.all, url: "/open/api/market_dept?type=step0&symbol="}],
        null,
        currencyArray,
        this.lowerCaseSymbolFunction);
    this._exchangeArray.push(exchange);
    
    // CoinTiger
    // TODO read env
    const COINTIGER_API_KEY: string = "100310001";
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.CoinTiger,
         ApiAccessType.plane,
        `https://api.cointiger.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/exchange/trading/api/market/depth?api_key=${COINTIGER_API_KEY}&type=step0&symbol=`}],
        null,
        currencyArray,
        this.lowerCaseSymbolFunction);
    this._exchangeArray.push(exchange);

    // EXRATES
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH});
    exchange = new Exchange(ExchangeId.EXRATES,
         ApiAccessType.plane,
        "https://api.exrates.me",
        [{orderBookUrlType: OrderBookUrlType.all, url: "/openapi/v1/public/orderbook/"}],
        "/openapi/v1/public/ticker?currency_pair=",
        currencyArray,
        this.lowerCaseSymbolFunctionWithDelimitaUS);
    this._exchangeArray.push(exchange);

    // HitBTC
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.HitBTC,
         ApiAccessType.plane,
        `https://api.hitbtc.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/api/2/public/orderbook/`}],
        null,
        currencyArray,
        this.upperCaseSymbolFunction);
    this._exchangeArray.push(exchange);

    // P2PB2B
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.P2PB2B,
        ApiAccessType.askBidSplitInterface,
        "https://api.p2pb2b.io",
        [{orderBookUrlType: OrderBookUrlType.buy, url: "/api/v1/public/book?offset=0&limit=100&side=buy&market="},
        {orderBookUrlType: OrderBookUrlType.sell, url: "/api/v1/public/book?offset=0&limit=100&side=sell&market="}],
        null,
        currencyArray,
        this.upperCaseSymbolFunctionWithDelimitaUS);
    this._exchangeArray.push(exchange);

    // CoinBene
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.CoinBene,
         ApiAccessType.plane,
        `http://openapi-exchange.coinbene.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/api/exchange/v2/market/orderBook?depth=100&symbol=`}],
        null,
        currencyArray,
        this.upperCaseSymbolFunctionWithDelimitaSL);
    this._exchangeArray.push(exchange);

    // fatbtc
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.fatbtc,
        ApiAccessType.cloudflare,
        "https://www.fatbtc.com",
        [{orderBookUrlType: OrderBookUrlType.all, url: "/m/depth/"}],
        null,
        currencyArray,
        this.upperCaseSymbolFunction);
    this._exchangeArray.push(exchange);
    
    // DEXTRADE
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH});
    // TODO error : get USDTBTC pair price
    //currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.USDT});
    exchange = new Exchange(ExchangeId.DEXTRADE,
         ApiAccessType.plane,
        `https://api.dex-trade.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/v1/public/book?pair=`}],
        "/v1/public/trades?pair=",
        currencyArray,
        this.upperCaseSymbolFunction);
    this._exchangeArray.push(exchange);
  }

  public static get instance(): ExchangeRepository {
    if (!this._instance) {
      this._instance = new ExchangeRepository();
    }
    return this._instance;
  }

  get exchangeArray(): Exchange[] {
      return this._exchangeArray;
  }

  getExchange(exchangeId: ExchangeId): Exchange | null {
    for (const exchange of this._exchangeArray) {
      if (exchange.exchangeId == exchangeId) {
        return exchange;
      }
    }
    return null;
  }

  isExistsCurrencyPair(exchangeId: ExchangeId, currencyPair: ICurrencyPair): boolean {
    const exchange = this.getExchange(exchangeId);
    if (exchange === null) {
      return false;
    }
    
    for (const ex_currencyPair of exchange.currencyPairArray) {
      if (ex_currencyPair == currencyPair) {
        return true;
      }
    }

    return false;
  }
}
