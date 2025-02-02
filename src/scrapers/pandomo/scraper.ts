import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'pandomo';

export const pandomoScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.pandomo.nl/huurwoningen/?filter-group-id=10&range-filter-from=&range-filter-to=&filter%5B39%5D=&filter%5B40%5D%5B%5D=Appartement&filter%5B43%5D=45%2C157&filter%5B44%5D%5B%5D=Groningen&filter%5B45%5D=&filter%5B75%5D%5B%5D=beschikbaar&orderBy%5B35%5D%5B1%5D%5Bdate_insert%5D=&orderBy%5B35%5D%5B0%5D%5Bpurchase_price_from%5D=&orderBy%5B35%5D%5B0%5D%5Brental_price_from%5D=',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.results > li')).map(
        (listing) => {
          console.log(listing);
          const titleElement = listing.querySelector(
            'a',
          ) as HTMLAnchorElement | null;

          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          // Zoek specifiek naar "Nieuw in verhuur" of "Verhuurd"
          const statusElements = listing.querySelectorAll('.object_status');
          let status = 'Onbekend';
          statusElements.forEach((el) => {
            const text = (el as HTMLElement).innerText.trim();
            if (text.includes('Nieuw in verhuur')) status = 'Nieuw in verhuur';
            if (text.includes('Verhuurd')) status = 'Verhuurd';
          });

          return { title, status };
        },
      );
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
