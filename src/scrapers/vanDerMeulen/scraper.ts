import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'vanDerMeulen';

export const vanDerMeulenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.vandermeulenmakelaars.nl/huurwoningen/?_plaats=groningen&_status=beschikbaar&_prijsbereik=775.00%2C1411.00&a',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.aw-card')).map(
        (listing) => {
          const titleElement = listing.querySelector(
            'a',
          ) as HTMLAnchorElement | null;
          const title = titleElement?.href
            ? titleElement.href.trim()
            : 'No link';

          return { title, status: 'Beschikbaar' };
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
