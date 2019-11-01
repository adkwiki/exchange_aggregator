import { Exchange, ApiAccessType } from "../model/Exchange";
import { ExchangeId } from '../model/enum/ExchangeId';
import { CurrencyId, ICurrencyPair } from '../model/enum/CurrencyId';

export class ExchangeRepository {

  private static _instance: ExchangeRepository;

  private _exchangeArray : Exchange[]; 

  // convert functions
  private lowerCaseSymbolFunctionWithDelimita = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left].toLowerCase()}_${CurrencyId[currencyPair.right].toLowerCase()}`;
  };

  private lowerCaseSymbolFunction = (currencyPair: ICurrencyPair) => {
    return `${CurrencyId[currencyPair.left].toLowerCase()}${CurrencyId[currencyPair.right].toLowerCase()}`;
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
        "/open/api/market_dept?type=step0&symbol=",
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
        `/exchange/trading/api/market/depth?api_key=${COINTIGER_API_KEY}&type=step0&symbol=`,
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
        "/openapi/v1/public/orderbook/",
        "/openapi/v1/public/ticker?currency_pair=",
        currencyArray,
        this.lowerCaseSymbolFunctionWithDelimita);
    this._exchangeArray.push(exchange);

    // fatbtc
    currencyArray = [];
    currencyArray.push({left: CurrencyId.ADK, right: CurrencyId.BTC});
    exchange = new Exchange(ExchangeId.fatbtc,
        ApiAccessType.cloudflare,
        "https://www.fatbtc.com",
        "/m/depth/",
        null,
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
}
