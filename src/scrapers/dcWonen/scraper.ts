import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'dcWonen';

export const dcWonenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Navigate to the page
    await page.goto('https://dcwonen.nl/appartement-huren-groningen/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Extract data
    const properties = await page.evaluate(() => {
      const listings = document.querySelectorAll(
        '.property-listing.list-view > div',
      ); // Get all child elements
      return Array.from(listings).map((listing) => {
        const titleElement = listing.querySelector('.property-title a');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const title = titleElement ? titleElement.href.trim() : 'No link';
        const status =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          listing.querySelector('.label-status')?.innerText.trim() ||
          'No status';
        return { title, status };
      });
    });
    await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog('DC wonen');
  } catch (err) {
    scraperCompletedLog('DC wonen', true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
