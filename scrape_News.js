const puppeteer = require('puppeteer');
const URL_FOR_AI_NEWS = 'https://www.futurepedia.io/news?time=All+Time&sort=New';

const scrapeInfiniteItems_news = async (page, itemTargetCount, DATA_NEWS, res) => {

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
    res.json(DATA_NEWS);
}

const Scrape_News = async (res, DATA_NEWS) => {


    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ['--disable-extensions'],
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],

        headless: true,
        defaultViewport: false,
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    try {
        const page = await browser.newPage();

        // For Getting the News
        await page.goto(URL_FOR_AI_NEWS, {timeout:0});
        await scrapeInfiniteItems_news(page, 100, DATA_NEWS, res);
    }
    catch (err) {
        console.log(err);
        res.send("Failed to retrieve data");

    }
    finally {
        await browser.close();
    }
}

module.exports = { Scrape_News };