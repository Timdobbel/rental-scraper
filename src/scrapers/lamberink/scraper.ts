import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions, settings } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';
import { sleep } from '../../utils/sleep';

const folder = 'lamberink';

export const lamberinkScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://lamberink.nl/wonen/aanbod?buy_rent=rent&object_type=appartement&search=Groningen&order_by=created_at-desc&page=1',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    // Wait a bit before removing the element and continuing
    await sleep(500);

    // Remove the unwanted element
    await page.evaluate(() => {
      const unwantedElement = document.querySelector(
        '#objects-app > div.index.view-visible > div > div > div > div',
      );
      if (unwantedElement) {
        unwantedElement.remove();
      }
    });

    // Get the listings
    const properties = await page.evaluate(({ minSize }) => {
      return Array.from(document.querySelectorAll('.card--object--properties'))
        .map((listing) => {
          const titleElement = listing.querySelector('a');

          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          return { title, status: '?' };
        })
        .filter((item) => item !== undefined);
    }, settings);

    // Close the browser
    await browser.close();

    // Write the results and log completion
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
