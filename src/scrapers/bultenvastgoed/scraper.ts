import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions, settings } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'bultenvastgoed';

export const bultenvastgoedScaper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Navigate to the page
    await page.goto('https://aanbod.bultenvastgoed.nl/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Extract data
    const properties = await page.evaluate((settings) => {
      return Array.from(document.querySelectorAll('.card.mb-3'))
        .map((card) => {
          const titleElement = card.querySelector('.card-title a') as Element;
          const priceElement = card.querySelector(
            '.col-auto.text-right div:first-child',
          );

          const sizeElement = card.querySelector('.propertylist_feature-text');

          const price = parseInt(
            priceElement?.innerText.replace(/[^\d]/g, '') as string,
            10,
          );

          const match = sizeElement?.innerText?.match(
            /(\d+(?:\.\d*)?)\s*(?:m2|㎡)/i,
          );
          const m2 = match ? parseFloat(match[1]) : null;

          if (!m2) return;

          if (
            isNaN(price) ||
            price >= settings.maxPrice ||
            m2 < settings.minSize
          ) {
            return;
          }

          return {
            title: titleElement.href ? titleElement.href : 'No link',
            status: '-',
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
