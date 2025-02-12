import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions, settings } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'solideVastgoed';

export const solideVastgoedScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://solideverhuur.nl/?action=epl_search&post_type=rental&property_location=20&property_price_from=800&property_price_to=1500',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(({ minSize }) => {
      return Array.from(document.querySelectorAll('.search-result'))
        .map((listing) => {
          const titleElement = listing.querySelector('.search-result-title a');
          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          // Extract and format the size
          const sizeElement =
            listing.querySelector('li i.fa-crop')?.parentElement;
          let size = 0;
          if (sizeElement) {
            const sizeText = sizeElement.innerText.match(/\d+/); // Extract number from text
            size = sizeText ? parseInt(sizeText[0], 10) : 0;
          }

          // Extract the status
          const statusElement = listing.querySelector('.status-sticker');
          let status = 'Onbekend';
          if (statusElement) {
            const text = statusElement.innerText.trim();
            if (text.includes('Nieuw')) status = 'Nieuw in verhuur';
            if (text.includes('Verhuurd')) status = 'Verhuurd';
          }

          if (size < minSize || status === 'Verhuurd') return undefined;

          return { title, status };
        })
        .filter((item) => item !== undefined);
    }, settings);

    // await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
