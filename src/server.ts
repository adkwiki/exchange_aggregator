import express from 'express';

import { ProxyExchangeApi } from './api/proxyExchangeApi';

const PORT = process.env.PORT || 3000;
const app = express();
app.get('/proxy_exchange_api', (req, res) => {
    //console.log("access /proxy_exchange_api");
    try {
        ProxyExchangeApi.processor(req, res);
    } catch {
        res.sendStatus(500);
    }
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
