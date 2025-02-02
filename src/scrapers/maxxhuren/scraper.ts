import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions, settings } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'maxxhuren';

export const maxxhurenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://maxxhuren.nl/objects/objects/search/city-groningen/type-appartement/min-400/max-1550/',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate((settings) => {
      return Array.from(document.querySelectorAll('.box-object'))
        .map((listing) => {
          const titleElement = listing.querySelector('a');
          const title = titleElement
            ? 'https://maxxhuren.nl' + titleElement.getAttribute('href')
            : 'No link';

          const statusElement = listing.querySelector(
            '.object-image span',
          ) as HTMLAnchorElement | null;
          const status = statusElement
            ? statusElement.innerText.trim() || 'Beschikbaar'
            : 'Beschikbaar';

          // Extract m² (living area)
          const sizeElement = listing.querySelector(
            '.col.text-left',
          ) as HTMLAnchorElement | null;
          const size = sizeElement ? sizeElement.innerText.trim() : 'Unknown';

          // Convert size to int and remove m2
          const sizeInt = parseInt(size.split(' ')[0], 10);

          if (sizeInt <= settings.minSize) return;

          return { title, status };
        })
        .filter((property) => property !== undefined);
    }, settings);

    await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
