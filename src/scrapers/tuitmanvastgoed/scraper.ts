import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'tuitmanvastgoed';

export const tuitmanvastgoedScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.tuitmanvastgoed.nl/woningaanbod/huur?availability=1&minlivablearea=25&moveunavailablelistingstothebottom=true&orderby=9&pricerange.maxprice=1500',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('.sys-page-of-properties > article'),
      ).map((listing) => {
        console.log(listing);
        const titleElement = listing.querySelector(
          'a',
        ) as HTMLAnchorElement | null;

        const title = titleElement?.href ? titleElement.href.trim() : 'No link';

        // Zoek specifiek naar "Nieuw in verhuur" of "Verhuurd"
        const statusElements = listing.querySelectorAll(
          '.object__status_container',
        );
        let status = 'Onbekend';
        statusElements.forEach((el) => {
          status = (el as HTMLElement).innerText.trim();
        });

        return { title, status };
      });
    });

    await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
