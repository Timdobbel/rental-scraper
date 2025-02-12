import { settings } from './../../config';
import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite, Properties } from '../../utils/fileUtils';
import path from 'path';

const folder = 'grunoVerhuur';

export const grunoVerhuurScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.grunoverhuur.nl/woningaanbod/huur?moveunavailablelistingstothebottom=true',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate((settings) => {
      return Array.from(document.querySelectorAll('.objectcontainer'))
        .map((listing) => {
          const titleElement = listing.querySelector('a');
          const sizeString = listing.querySelector('.object_sqfeet')?.innerText;
          const match = sizeString?.match(/(\d+)\s*m²/);
          const sizeNumber = match ? parseInt(match[1], 10) : null;
          console.log(sizeNumber);

          const title = titleElement
            ? 'https://www.grunoverhuur.nl' + titleElement.getAttribute('href')
            : 'No link';

          if (!title || !sizeNumber) return;

          const priceText = (
            listing?.querySelector('.obj_price') as HTMLElement
          )?.innerText;

          let price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

          if (
            isNaN(price) ||
            price >= settings.maxPrice ||
            sizeNumber < settings.minSize ||
            price <= settings.minPrice
          ) {
            return;
          }

          const textContent = listing.innerText.toLowerCase();
          const containsGroningen = textContent.includes('groningen');

          if (!containsGroningen) return;

          const statusElement = listing.querySelector('.object_status span');
          const status = statusElement
            ? statusElement.innerText.toLowerCase()
            : 'waarschijnlijk verhuurd';

          return {
            title,
            status,
          };
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
