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

  private bitlocusConvertFunction = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left]}${CurrencyId[currencyPair.right]}?limit=1`;
  };

  private zeroStringFunction = (currencyPair: ICurrencyPair) => {
    return "";
  };

  private stexConvertFunction = (currencyPair: ICurrencyPair) => {
    if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.BTC) {
      return "743";
    } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.ETH) {
      return "952";
    } else if (currencyPair.left === CurrencyId.ETH && currencyPair.right === CurrencyId.BTC) {
      return "2";
    } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.USD) {
      return "744";
    } else if (currencyPair.left === CurrencyId.BTC && currencyPair.right === CurrencyId.USD) {
      return "702";
    } else if (currencyPair.left === CurrencyId.ADK && currencyPair.right === CurrencyId.EUR) {
      return "745";
    } else if (currencyPair.left === CurrencyId.BTC && currencyPair.right === CurrencyId.EUR) {
      return "703";
    } else {
      throw new Error(`stex unknown pair ${currencyPair.left}/${currencyPair.right}:`)
    }
  };


  private constructor() {
    this._exchangeArray = [];
    let exchange;
    let currencyArray: ICurrencyPair[];

    // AidosMarket
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.AidosMarket,
        ApiAccessType.plane,
        "https://aidosmarket.com",
        [{orderBookUrlType: OrderBookUrlType.all, url: "/api/order-book"}],
        null,
        currencyArray,
        this.zeroStringFunction);
    this._exchangeArray.push(exchange);

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
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH, bridge: {left: CurrencyId.ETH, right: CurrencyId.BTC}});
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

    // IDAX
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH, bridge:{left:CurrencyId.ETH, right: CurrencyId.BTC}});
    exchange = new Exchange(ExchangeId.IDAX,
        ApiAccessType.plane,
        `https://openapi.idax.pro`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/api/v2/depth?pair=`}],
        "/api/v2/ticker?pair=",
        currencyArray,
        this.upperCaseSymbolFunctionWithDelimitaUS);
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

    // STEX
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH, bridge:{left:CurrencyId.ETH, right: CurrencyId.BTC}});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.USD, bridge:{left:CurrencyId.BTC, right: CurrencyId.USD}});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.EUR, bridge:{left:CurrencyId.BTC, right: CurrencyId.EUR}});
    exchange = new Exchange(ExchangeId.STEX,
        ApiAccessType.plane,
        `https://api3.stex.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/public/orderbook/`}],
        "/public/ticker/",
        currencyArray,
        this.stexConvertFunction);
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
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.ETH, bridge:{left:CurrencyId.ETH, right: CurrencyId.BTC}});
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.USDT, bridge:{left:CurrencyId.BTC, right: CurrencyId.USDT}});
    exchange = new Exchange(ExchangeId.DEXTRADE,
        ApiAccessType.plane,
        `https://api.dex-trade.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/v1/public/book?pair=`}],
        "/v1/public/ticker?pair=",
        currencyArray,
        this.upperCaseSymbolFunction);
    this._exchangeArray.push(exchange);

    // BITLOCUS
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.EUR, bridge:{left:CurrencyId.BTC, right: CurrencyId.EUR}});
    exchange = new Exchange(ExchangeId.BITLOCUS,
        ApiAccessType.plane,
        `https://api.bitlocus.com`,
        [{orderBookUrlType: OrderBookUrlType.all, url: `/order_book/`}],
        "/trade_history/",
        currencyArray,
        this.bitlocusConvertFunction);
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

  getCurrencyPair(exchangeId: ExchangeId, currencyPair: ICurrencyPair): ICurrencyPair | null {
    const exchange = this.getExchange(exchangeId);
    if (exchange === null) {
      return null;
    }
    
    for (const ex_currencyPair of exchange.currencyPairArray) {
      if (ex_currencyPair.left == currencyPair.left && ex_currencyPair.right == currencyPair.right) {
        return ex_currencyPair;
      }
    }

    return null;
  }
}
