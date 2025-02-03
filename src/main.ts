import { groningenVastgoed } from './scrapers/050vastgoed/scraper';
import { dcWonenScraper } from './scrapers/dcWonen/scraper';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { pandomoScraper } from './scrapers/pandomo/scraper';
import { tuitmanvastgoedScraper } from './scrapers/tuitmanvastgoed/scraper';
import { campusGroningenScraper } from './scrapers/campusGroningen/scraper';
import { maxxhurenScraper } from './scrapers/maxxhuren/scraper';
import { eentweedrieWonenScraper } from './scrapers/123wonen/scraper';
import { grunoVerhuurScraper } from './scrapers/grunoVerhuur/scraper';
import { househuntingScraper } from './scrapers/househunting/scraper';

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

// List of all scrapers
const scrapers = [
  maxxhurenScraper,
  pandomoScraper,
  groningenVastgoed,
  dcWonenScraper,
  tuitmanvastgoedScraper,
  campusGroningenScraper,
  eentweedrieWonenScraper,
  grunoVerhuurScraper,
];

const runScrapers = async () => {
  for (const scraper of scrapers) {
    await scraper();
  }

  printBreakline(count++);

  // Schedule next execution only after completion
  setTimeout(runScrapers, 10000);
};

const main = async () => {
  // await runScrapers();
  househuntingScraper();
};

main();
