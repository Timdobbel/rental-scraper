import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'rotsVastgoed';

export const rotsVastgoedScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.rotsvast.nl/woningaanbod/?type=2&city=Groningen&office=0&minimumSurface=40&type1[]=Appartement&type1[]=Woonhuis',
      {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      },
    );

    const properties = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          '#viewOther > div > div.residence-gallery-wrapper.row > div',
        ),
      ).map((listing) => {
        console.log(listing);

        const titleElement = listing.querySelector(
          'a',
        ) as HTMLAnchorElement | null;

        const title = titleElement?.href ? titleElement.href.trim() : 'No link';

        // Zoek specifiek naar "Nieuw in verhuur" of "Verhuurd"
        const statusElements = listing
          .querySelector('.status')
          .innerText.toLowerCase();

        return { title, status: statusElements };
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
