import dotenv from 'dotenv';
import chalk from 'chalk';
import { scrapers } from './config';

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

const runScrapers = async () => {
  for (const scraper of scrapers) {
    await scraper();
  }

  printBreakline(count++);

  // Schedule next execution only after compfvv  letion
  setTimeout(runScrapers, 45000);
};

const main = async () => {
  if (process.env.NODE_ENV !== 'development') {
    await runScrapers();
  } else {
    // Debugging a single scraper:
    scrapers[0]();
  }
};

main();
