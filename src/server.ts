import express from 'express';
import cors from 'cors';

import { ProxyExchangeApi } from './api/proxyExchangeApi';

// api endpoint
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

// proxy & normalize orderbook api
app.get('/proxy_exchange_api', (req, res) => {
    //console.log("access /proxy_exchange_api");
    try {
        ProxyExchangeApi.processor(req, res);
    } catch {
        res.sendStatus(500);
    }
});

// health check
app.get('/status', (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

// TODO cycle exec : mainte service status
// cycle 15min?
