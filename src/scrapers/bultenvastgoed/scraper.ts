import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
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
    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.card.mb-3')).map((card) => {
        const titleElement = card.querySelector('.card-title a');
        const priceElement = card.querySelector(
          '.col-auto.text-right div:first-child',
        );
        const imageElement = card.querySelector('.photo_container img');
        const locationElement = card.querySelector('.card-title .small');
        const sizeElement = card.querySelector('.propertylist_feature-text');

        return {
          title: titleElement ? titleElement.innerText.trim() : 'Unknown',
          status: '-',
          //   link: titleElement ? titleElement.href : 'No link',
          //   price: priceElement ? priceElement.innerText.trim() : 'No price',
          //   image: imageElement ? imageElement.src : 'No image',
          //   location: locationElement
          //     ? locationElement.innerText.trim()
          //     : 'Unknown',
          //   size: sizeElement ? sizeElement.innerText.trim() : 'No size',
        };
      });
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
