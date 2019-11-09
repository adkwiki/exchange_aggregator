import { Exchange } from "../model/Exchange";
import { ExchangeId } from '../model/enum/ExchangeId';
import { ICurrencyPair } from '../model/enum/CurrencyId';
import { AidosMarket } from "../model/exchange/AidosMarket";

import * as ExchangeFactory from "../model/ExchangeFactory"
import { Coineal } from "../model/exchange/Coineal";
import { CoinTiger } from "../model/exchange/CoinTiger";
import { EXRATES } from "../model/exchange/EXRATES";
import { HitBTC } from "../model/exchange/HitBTC";
import { IDAX } from "../model/exchange/IDAX";
import { P2PB2B } from "../model/exchange/P2PB2B";
import { STEX } from "../model/exchange/STEX";
import { CoinBene } from "../model/exchange/CoinBene";
import { fatbtc } from "../model/exchange/fatbtc";
import { DEXTRADE } from "../model/exchange/DEXTRADE";
import { BITLOCUS } from "../model/exchange/BITLOCUS";

export class ExchangeRepository {

  private static _instance: ExchangeRepository;

  private _exchangeArray : Exchange[]; 

  private constructor() {
    this._exchangeArray = [];
    this._exchangeArray.push(ExchangeFactory.createInstance(AidosMarket));
    this._exchangeArray.push(ExchangeFactory.createInstance(Coineal));
    this._exchangeArray.push(ExchangeFactory.createInstance(CoinTiger));
    this._exchangeArray.push(ExchangeFactory.createInstance(EXRATES));
    this._exchangeArray.push(ExchangeFactory.createInstance(HitBTC));
    this._exchangeArray.push(ExchangeFactory.createInstance(IDAX));
    this._exchangeArray.push(ExchangeFactory.createInstance(P2PB2B));
    this._exchangeArray.push(ExchangeFactory.createInstance(STEX));
    this._exchangeArray.push(ExchangeFactory.createInstance(CoinBene));
    this._exchangeArray.push(ExchangeFactory.createInstance(fatbtc));
    // order not exists
    //this._exchangeArray.push(ExchangeFactory.createInstance(DEXTRADE));
    this._exchangeArray.push(ExchangeFactory.createInstance(BITLOCUS));
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
