const express = require('express');
const { Scrape_News } = require('./scrape_News')
const { Scrape_Tools } = require('./Scrape_Tools')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

let DATA_NEWS = [];
let DATA_AI = [];

app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        "Welcome To": "AI HUB API to get Latest news and tools regarding Artificial Intelligence Technology",
        "For AiNews": "Visit-> '/LatestAiNews' endpoint",
        "For AiTools": "Visit-> '/AiTools' endpoint"
    })
});

app.get('/LatestAiNews', (req, res) => {
    Scrape_News(res, DATA_NEWS);
});

app.get('/AiTools', (req, res) => {
    Scrape_Tools(res, DATA_AI);
});

app.listen(port, () => {
    console.log(`Server started at port number ${port} `);
})