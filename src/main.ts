import { campusScraper } from './scrapers/campusScraper';
import { dcWonenScraper } from './scrapers/dcWonen/scraper';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Main entry point.
 *  - Schedules scrapers
 */
const main = async () => {
  // Run dcWonenScraper every 20 seconds
  setInterval(() => {
    dcWonenScraper();
  }, 20000); // 20 seconds in milliseconds
};

main();
