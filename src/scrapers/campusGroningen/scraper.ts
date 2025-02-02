import puppeteer from 'puppeteer';
import { logErrorToFile, scraperCompletedLog } from '../../utils/logger';
import { launchOptions } from '../../config';
import { compareAndWrite, Properties } from '../../utils/fileUtils';
import path from 'path';

const folder = 'campusGroningen';

export const campusGroningenScraper = async () => {
  try {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(
      'https://www.campusgroningen.com/huren-groningen/appartement-huren-groningen',
      { waitUntil: 'domcontentloaded', timeout: 10000 },
    );

    const links = await page.$$eval('.row.matchheight-container a', (anchors) =>
      anchors.map((a) => a.href),
    );
    const results: Properties = [];

    for (const link of links) {
      const newPage = await browser.newPage();
      await newPage.goto(link, {
        waitUntil: 'domcontentloaded',
        timeout: 50000,
      });

      try {
        const status = await newPage.$eval(
          '.table.table-condensed button',
          (button) => button.innerText.trim(),
        );
        if (status === 'Deelnemen' || status === 'Volgeboekt') {
          results.push({ title: link, status });
        }
      } catch {
        console.warn(`No status button found for ${link}`);
      }

      await newPage.close();
    }

    await browser.close();
    compareAndWrite(folder, results);
    scraperCompletedLog(folder);
  } catch (err) {
    scraperCompletedLog(folder, true);
    logErrorToFile(err, path.join(__dirname, 'scraper_errors.log'));
    console.log(`[${folder}] ${err}`);
  }
};
