import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'househunting';

export const househuntingScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://househunting.nl/woningaanbod/?available-since=&m2=50%2B&type=for-rent&filter_location=Groningen&lat=53.2193835&lng=6.5665018&km=5&km=5&min-price=300&max-price=1500&vestiging=&sort=',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.locations > li')).map(
        (listing) => {
          console.log(listing);

          const titleElement = listing.querySelector(
            'a',
          ) as HTMLAnchorElement | null;
          const title = titleElement?.href
            ? titleElement.href.split('?')[0].trim()
            : 'No link';

          const status = (
            listing.querySelector('.location_lable') as HTMLDivElement
          ).innerText.toLowerCase();

          console.log(status);

          return {
            title,
            status: status === 'verhuurd' ? 'verhuurd' : 'Mogelijk beschikbaar',
          };
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
