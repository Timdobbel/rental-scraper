import puppeteer from 'puppeteer';
import fs from 'fs';
import { log, scraperCompletedLog } from '../../utils/logger';

export const dcWonenScraper = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to the page
  await page.goto('https://dcwonen.nl/appartement-huren-groningen/', {
    waitUntil: 'domcontentloaded',
  });

  // Extract data
  const properties = await page.evaluate(() => {
    const listings = document.querySelectorAll(
      '.property-listing.list-view > div',
    ); // Get all child elements
    return Array.from(listings).map((listing) => {
      const title =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        listing.querySelector('.property-title')?.innerText.trim() ||
        'No title';
      const status =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        listing.querySelector('.label-status')?.innerText.trim() || 'No status';
      return { title, status };
    });
  });

  // Save data to results.json
  fs.writeFileSync('results.json', JSON.stringify(properties, null, 2));
  scraperCompletedLog('DC wonen', true);
  await browser.close();
};
