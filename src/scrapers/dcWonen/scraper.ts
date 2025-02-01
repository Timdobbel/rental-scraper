import puppeteer from 'puppeteer';
import { scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite } from '../../utils/fileUtils';

const folder = 'dcWonen';

export const dcWonenScraper = async () => {
  // const browser = await puppeteer.launch(launchOptions);
  // const page = await browser.newPage();

  // // Navigate to the page
  // await page.goto('https://dcwonen.nl/appartement-huren-groningen/', {
  //   waitUntil: 'domcontentloaded',
  // });

  // // Extract data
  // const properties = await page.evaluate(() => {
  //   const listings = document.querySelectorAll(
  //     '.property-listing.list-view > div',
  //   ); // Get all child elements
  //   return Array.from(listings).map((listing) => {
  //     const title =
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-expect-error
  //       listing.querySelector('.property-title')?.innerText.trim() ||
  //       'No title';
  //     const status =
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-expect-error
  //       listing.querySelector('.label-status')?.innerText.trim() || 'No status';
  //     return { title, status };
  //   });
  // });

  // Save data to results.json
  try {
    compareAndWrite(folder, [
      {
        title: 'Woning Tuinbouwstraat',
        status: 'Te huur',
      },
      {
        title: 'Woning Duikerstraat',
        status: 'Te huur',
      },
      {
        title: 'Appartement Verlengde Hereweg',
        status: 'Te huur',
      },
    ]);
    scraperCompletedLog('DC wonen');
  } catch {
    scraperCompletedLog('DC wonen', true);
  }

  // await browser.close();
};
