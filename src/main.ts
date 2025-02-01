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
  dcWonenScraper();
};

main();
