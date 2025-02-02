import { settings } from './../../config';
import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite, Properties } from '../../utils/fileUtils';
import path from 'path';

const folder = '123wonen';

export const eentweedrieWonenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto('https://www.123wonen.nl/huurwoningen/in/groningen', {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const properties = (await page.evaluate((settings) => {
      return Array.from(document.querySelectorAll('.pandlist-container'))
        .map((listing) => {
          const titleElement = listing.querySelector('a');

          const title = titleElement
            ? titleElement.getAttribute('href')
            : 'No link';

          let status = 'beschikbaar';
          //@ts-expect-error
          const listingText = listing.innerText.toLowerCase();

          if (listingText.includes('in optie')) {
            status = 'in optie';
          } else if (listingText.includes('verhuurd')) {
            status = 'verhuurd';
          }

          // Zoek woonoppervlakte
          let size = 0;
          const spans = Array.from(
            listing.querySelectorAll('.pand-specs li span'),
          ) as HTMLSpanElement[];
          for (let i = 0; i < spans.length; i++) {
            if (spans[i].innerText.trim() === 'Woonoppervlakte') {
              const sizeText = spans[i + 1]?.innerText
                .trim()
                .replace(' m²', '');
              size = sizeText ? parseInt(sizeText, 10) : 0;
              break;
            }
          }

          // Zoek huurprijs
          let price = 0;
          const priceElement = listing.querySelector('.pand-price');
          if (priceElement) {
            //@ts-expect-error
            const priceText = priceElement.innerText.match(/\d+/g);
            price = priceText ? parseInt(priceText.join(''), 10) : 0;
          }

          // Filter op prijs en woonoppervlakte
          if (size < settings.minSize || price > settings.maxPrice) return;

          return { title, status };
        })
        .filter((property) => property !== undefined);
    }, settings)) as Properties;

    await browser.close();
    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
