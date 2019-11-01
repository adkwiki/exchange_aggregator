import express from 'express';

import { ExchangeRepository } from './repository/ExchangeRepository';
import { Exchange} from './model/Exchange'
import { OrderbookCrawler } from './external/orderbookCrawler';

const PORT = process.env.PORT || 3000;
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

const exchangeRepo: ExchangeRepository = ExchangeRepository.instance;
const exchangeArray: Exchange[] = exchangeRepo.exchangeArray;
//console.log(exchangeArray);

// TODO request param map
/*
let promises = [];
for (const exchange of exchangeArray) {
    console.log(exchange);
    
    const promise = new Promise((resolve, reject) => { 
        const orderbookCrawler: OrderbookCrawler = new OrderbookCrawler(exchange);
        resolve(orderbookCrawler.crawl());
    });

    promises.push(promise);
}

Promise.all(promises).then( function (orderbookArray) {
    console.log( JSON.stringify(orderbookArray)) ;
})
.catch( function (reason) {
    console.log(reason);
});
*/
