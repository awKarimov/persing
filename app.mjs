import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
});

const page = await browser.newPage();
await page.goto("https://quotes.toscrape.com/js/");

async function nextPage() {
  await page.waitForSelector(".quote");

  const quoteElements = await page.$$(".quote");

  const quotePromises = quoteElements.map(async (quote) => {
    const text = await quote.$eval(".text", (el) => el.innerText);
    const author = await quote.$eval(".author", (el) => el.innerText);
    const tags = await quote.$$eval(".tag", (els) =>
      els.map((el) => el.innerText)
    );

    return { text, author, tags };
  });

  const quotes = await Promise.all(quotePromises);

  console.log(quotes);

  const nextButton = await page.$(".next > a");

  if (nextButton) {
    await Promise.all([page.waitForNavigation(), nextButton.click()]);

    await nextPage();
  }
}

await nextPage();
// await browser.close();
