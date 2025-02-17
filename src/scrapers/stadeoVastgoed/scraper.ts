import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';
import path from 'path';

const folder = 'stadeoVastgoed';

export const stadeoVastgoedScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.goto(
      'https://www.stadeovastgoed.nl/woningaanbod?offer=rent&surface=45&location=Groningen',
      {
        waitUntil: 'networkidle2', // Ensures all network requests are complete
        timeout: 30000, // Increase timeout if needed
      },
    );

    // Wait for the elements to load
    await page.waitForSelector('.eazlee_object', { timeout: 10000 });

    // Extract data
    const properties = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.eazlee_object')).map(
        (listing) => {
          console.log(listing);

          const titleElement = listing.querySelector('a');
          const title = titleElement ? titleElement.href.trim() : 'No link';

          const statusElement = listing.querySelector(
            '.eazlee_top_overlay_badge_status',
          );
          const status = statusElement
            ? statusElement.innerText.trim()
            : 'Waarschijnlijk niet beschikbaar';

          return { title: listing.href, status };
        },
      );
    });

    console.log(properties);

    compareAndWrite(folder, properties);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
