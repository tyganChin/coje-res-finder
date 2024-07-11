const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the connection when the server is closed
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing connection: ' + err.stack);
        }
        console.log('Connection closed');
        process.exit();
    });
});


/* allows client to access profile in database with a matching username */
app.get('/availability', getAvailibility)

const puppeteer = require('puppeteer');

const restaurants = [
    ['coquette', '.sc-hCwLRM.ixXOVD'],
    ['lolitafortpoint', '.sc-hCwLRM.ixXOVD'],
    ['rukaboston', '.sc-hCwLRM.ixXOVD'],
    ['yvonneboston', '.sc-hCwLRM.ixXOVD'],
    ['lolitabackbay', '.sc-hCwLRM.ixXOVD'],
    ['marielma', '.sc-hCwLRM.ivShBF']
];

const resLink = 'https://www.sevenrooms.com/reservations/';

async function runPuppeteer([name, selector], end) {

    const browser = await puppeteer.launch();
    
    /* go to reservations page */
    const page = await browser.newPage();
    const link = resLink + name + end;
    await page.goto(link, { waitUntil: 'networkidle2' });

    /* search */
    await page.waitForSelector('button[data-test="sr-search-button"]');
    await Promise.all([
        page.click('button[data-test="sr-search-button"]'),
        page.waitForSelector('.sc-jNHqnW.dnXXGx')
    ]);

    /* save open time slots to variable */
    const divData = await page.evaluate((selector) => {
        const parentElement = document.querySelector(selector);
        if (parentElement) {
            const elements = parentElement.querySelectorAll('[class^="sc-icMgfS"]');
            return Array.from(elements).map(el => el.innerText);
        } else {
            return [];
        }
    }, selector);

    await browser.close();

    /* log restaurant and available times to console */
    console.log(name + " is done")
    return { name, divData, link};
}

async function getAvailibility(req, res) {

    /* format the given data */
    const { date, time, guests } = req.query;
    const end = '?default_date=' + date + '&default_party_size=' + guests + '&default_time=' + time;
    
    /* get times slots for each of the restaurants */
    const results = new Array(6);
    const promises = restaurants.map((restaurant, i) =>
        runPuppeteer(restaurant, end).then(result => {
        results[i] = result;
        })
    );
  
    await Promise.all(promises);

    res.json(results);
}
