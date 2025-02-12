import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'zeeven';

export const zeevenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.zeeven.nl/aanbod/woningaanbod/GRONINGEN/500-1500/huur/',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.al2woning')).map(
        (listing) => {
          console.log(listing);

          const titleElement = listing.querySelector(
            'a',
          ) as HTMLAnchorElement | null;
          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          const statusElement = listing.querySelector('.objectstatusbanner');
          const status = statusElement?.innerText;

          return { title, status };
        },
      );
    });

    // await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
