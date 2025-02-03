import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = '050vastgoed';

export const groningenVastgoed = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://050vastgoed.nl/woningaanbod/huur/groningen?availability=1&locationofinterest=Groningen&minlivablearea=25&moveunavailablelistingstothebottom=true&orderby=8&pricerange.maxprice=2500',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('.object_list > article'),
      ).map((listing) => {
        console.log(listing);

        const titleElement = listing.querySelector(
          '.img-container',
        ) as HTMLAnchorElement | null;
        const title = titleElement?.href
          ? titleElement.href.split('?')[0].trim()
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
