const puppeteer = require('puppeteer');
const URL_FOR_AI_TOOLS = 'https://www.futurepedia.io';

const scrapeInfiniteItems_tools = async (page, itemTargetCount, DATA_AI, res) => {

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
    res.json(DATA_AI);

}
const Scrape_Tools = async (res, DATA_AI) => {

    try {
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
        await scrapeInfiniteItems_tools(page, 150, DATA_AI, res);
    }
    catch(err) {
        console.log(err);
        console.log("Failed to retrieve data");
    }
    finally {
        await browser.close();
    }

}

module.exports = { Scrape_Tools };