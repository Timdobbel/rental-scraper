import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'kpmakelaars';

export const kpmakelaarsScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.kpmakelaars.nl/woningaanbod?offer=rent&location=Groningen&minprice=550&maxprice=1550',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const cookieButton = await page.$('[data-testid="uc-accept-all-button"]');

    await cookieButton.click();

    const properties = await page.evaluate(() => {
      const listings = document.querySelectorAll('.eazlee_object');
      console.log(`Found ${listings.length} listings`);

      return Array.from(listings)
        .map((listing) => {
          const linkElement = listing.getAttribute('href');

          return {
            title: linkElement.href
              ? `https://www.kpmakelaars.nl/${linkElement}`
              : 'Geen link',
            status: 'todo',
          };
        })
        .filter((item) => item !== undefined);
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
