import * as Express from 'express';
import { OrderbookCrawler } from '../external/orderbookCrawler';
import { ExchangeRepository } from '../repository/ExchangeRepository';

export class ProxyExchangeApi {

    static processor(req: Express.Request, res: Express.Response) {
        if (!(req.query.cp)) {
            console.log("invalid param : cp not found");
            res.sendStatus(400);
            return;
        }

        console.log(req.query.cp);

        const exchangeRepo: ExchangeRepository = ExchangeRepository.instance;

        // データ取得
        let promises = [];
        for (const cpParam of req.query.cp) {
            var paramElems = cpParam.split('_');
            if (paramElems.length != 3) {
                console.log(`invalid param ${cpParam}`);
                res.sendStatus(400);
                return;
            }

            // 指定された取引所＋通貨ペアのみか確認する
            const exchangeId = Number(paramElems[0]);
            const exchange = exchangeRepo.getExchange(exchangeId);
            if (exchange === null) {
                console.log(`invalid param : exchangeId ${exchangeId}`)
                res.sendStatus(400);
                return;
            }
            const currencyPair = {left: Number(paramElems[1]), right: Number(paramElems[2])};
            if (exchangeRepo.isExistsCurrencyPair(exchangeId, currencyPair)) {
                console.log(`invalid param : currencyPair ${paramElems}`)
                res.sendStatus(400);
                return;
            }

            //console.log(JSON.stringify(currencyPair));

            const promise = new Promise((resolve, reject) => { 
                const orderbookCrawler: OrderbookCrawler = new OrderbookCrawler(exchange, currencyPair);
                resolve(orderbookCrawler.crawl());
            });
            promises.push(promise);
        }

        Promise.all(promises).then( function (orderbook) {
            console.log("orderbook: " + JSON.stringify(orderbook));
            res.send(JSON.stringify(orderbook));
        })
        .catch( function (reason) {
            console.log(reason);
            res.sendStatus(500);
            return;
        });        
    }

}