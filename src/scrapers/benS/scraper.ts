import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions, settings } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'benS';

export const benSScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.bensverhuurenbeheer.nl/aanbod/status=verhuurd/woonplaats=groningen',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    // Get the listings
    const properties = await page.evaluate(({ minSize }) => {
      return Array.from(document.querySelectorAll('#verhuur > a'))
        .map((listing) => {
          const titleElement = listing;

          const status = listing.querySelector('figure > div')?.innerText;

          console.log(status);
          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          return { title, status };
        })
        .filter((item) => item !== undefined);
    }, settings);

    // Close the browser
    // await browser.close();

    // Write the results and log completion
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
