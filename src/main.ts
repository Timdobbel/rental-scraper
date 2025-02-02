import { groningenVastgoed } from './scrapers/050vastgoed/scraper';
import { campusScraper } from './scrapers/campusScraper';
import { dcWonenScraper } from './scrapers/dcWonen/scraper';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { pandomoScraper } from './scrapers/pandomo/scraper';
// Load environment variables from .env file
dotenv.config();

/**
 * Main entry point.
 *  - Schedules scrapers
 */

let count = 1;

const main = async () => {
  setInterval(() => {
    console.log(chalk.dim.italic(`Iteration: ${count}`));
    pandomoScraper();
    groningenVastgoed();
    dcWonenScraper();
    count++;
  }, 60000);
};

main();
