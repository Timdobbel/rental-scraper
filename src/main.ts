import { campusScraper } from './scrapers/campusScraper';
import { dcWonenScraper } from './scrapers/dcWonen/scraper';

/**
 * Main entry point.
 *  - Schedules scrapers
 */
const main = async () => {
  dcWonenScraper();
};

main();
