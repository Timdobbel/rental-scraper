import { groningenVastgoed } from './scrapers/050vastgoed/scraper';
import {
  dcWonenScraper,
  grunoVerhuurScraper,
} from './scrapers/dcWonen/scraper';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { pandomoScraper } from './scrapers/pandomo/scraper';
import { tuitmanvastgoedScraper } from './scrapers/tuitmanvastgoed/scraper';
import { campusGroningenScraper } from './scrapers/campusGroningen/scraper';
// Load environment variables from .env file
dotenv.config();

/**
 * Main entry point.
 *  - Schedules scrapers
 */

let count = 1;

const printBreakline = (count: number) => {
  console.log(
    chalk.yellowBright(
      `\n---->> Scrapers Complete! Iteration #${count} <<----`,
    ),
  );
};

const main = async () => {
  setInterval(async () => {
    await pandomoScraper();
    await groningenVastgoed();
    await dcWonenScraper();
    await tuitmanvastgoedScraper();
    await campusGroningenScraper();
    printBreakline(count);
    count++;
  }, 50000);
};

main();
