const express = require('express');
const puppeteer = require('puppeteer');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const URL_FOR_AI_TOOLS = 'https://www.futurepedia.io';
const URL_FOR_AI_NEWS = 'https://www.futurepedia.io/news?time=All+Time&sort=New';

let DATA_NEWS = [];
let DATA_AI = [];

app.use(express.json());

const scrapeInfiniteItems_news = async (page, itemTargetCount) => {

    while (itemTargetCount > DATA_NEWS.length) {

        DATA_NEWS = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll(".MuiBox-root .css-73ubzs"));
            return items.map((item) => ({
                News: item.querySelector('a > p').innerText,
                Link: item.querySelector('a').href,
            }));
        });

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log(DATA_NEWS);
    console.log(DATA_NEWS.length);
}
const scrapeInfiniteItems_tools = async (page, itemTargetCount) => {

    while (itemTargetCount > DATA_AI.length) {

        DATA_AI = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll(".MuiBox-root .css-1qnl62i"));
            return items.map((item) => ({
                AI_Name: item.querySelector('a > div > h3').innerText,
                Description: item.querySelector('a > p').innerText,
                Visit_At: item.querySelector('a').href,
            }));
        });

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(DATA_AI);
    console.log(DATA_AI.length);
}

async function run1() {

    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],

        headless: false,
        defaultViewport: false,
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    // For Getting the News
    await page.goto(URL_FOR_AI_NEWS);
    await scrapeInfiniteItems_news(page, 100);

    await browser.close();
}
async function run2() {

    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        headless: false,
        defaultViewport: false,
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    //For Getting the Tools
    await page.goto(URL_FOR_AI_TOOLS);
    await scrapeInfiniteItems_tools(page, 150);

    await browser.close();
}

app.get('/', (req, res) => {
    run1();
    run2();
    res.json({
        "Welcome To": "AI HUB API to get Latest news and tools regarding Artificial Intelligence Technology",
        "For AiNews": "Visit-> '/LatestAiNews' endpoint",
        "For AiTools": "Visit-> '/AiTools' endpoint"
    })
});

app.get('/LatestAiNews', (req, res) => {
    res.json(DATA_NEWS);
});

app.get('/AiTools', (req, res) => {
    res.json(DATA_AI);
});

app.listen(port, () => {
    console.log(`Server started at port number ${port} `);
})