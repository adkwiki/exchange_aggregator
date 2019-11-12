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

        //console.log(req.query.cp);

        const exchangeRepo: ExchangeRepository = ExchangeRepository.instance;

        let promises = [];
        for (const cpParam of req.query.cp) {
            var paramElems = cpParam.split('_');
            if (paramElems.length != 3) {
                console.log(`invalid param ${cpParam}`);
                res.sendStatus(400);
                return;
            }

            // check exchange x currency pair
            const exchangeId = Number(paramElems[0]);
            const exchange = exchangeRepo.getExchange(exchangeId);
            if (exchange === null) {
                console.log(`invalid param : exchangeId ${exchangeId}`)
                res.sendStatus(400);
                return;
            }

            const currencyPair = exchangeRepo.getCurrencyPair(exchangeId, {left: Number(paramElems[1]), right: Number(paramElems[2])});
            if (currencyPair === null) {
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

        Promise.all(promises).then((orderbook) => {
            //console.log("orderbook: " + JSON.stringify(orderbook));
            res.send(JSON.stringify(orderbook));
        })
        .catch((reason) => {
            console.log(reason);
            res.sendStatus(500);
            return;
        });        
    }
}