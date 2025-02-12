import dotenv from 'dotenv';
import { scrapers } from './config';

// Load environment variables from .env file
dotenv.config();

// This script only runs all scrapers once
const runScrapers = async () => {
  for (const scraper of scrapers) {
    await scraper();
  }
};

const main = async () => {
  await runScrapers();

  process.exit();
};

main();
