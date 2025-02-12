import { LaunchOptions } from 'puppeteer';
import path from 'path';
import os from 'os';
import { pandomoScraper } from './scrapers/pandomo/scraper';
import { tuitmanvastgoedScraper } from './scrapers/tuitmanvastgoed/scraper';
import { campusGroningenScraper } from './scrapers/campusGroningen/scraper';
import { maxxhurenScraper } from './scrapers/maxxhuren/scraper';
import { eentweedrieWonenScraper } from './scrapers/123wonen/scraper';
import { grunoVerhuurScraper } from './scrapers/grunoVerhuur/scraper';
import { househuntingScraper } from './scrapers/househunting/scraper';
import { bultenvastgoedScaper } from './scrapers/bultenvastgoed/scraper';
import { groningenVastgoed } from './scrapers/050vastgoed/scraper';
import { dcWonenScraper } from './scrapers/dcWonen/scraper';
import { solideVastgoedScraper } from './scrapers/solideVastgoed/scraper';
import { lamberinkScraper } from './scrapers/lamberink/scraper';

// Get user's home directory dynamically
const homeDir = os.homedir();

// Construct the extension path dynamically
const extensionPath = path.join(homeDir, 'rental-scraper', 'src', '3.5.1_0');

export const launchOptions: LaunchOptions = {
  headless: process.env.NODE_ENV === 'development' ? false : true,
  slowMo: 0,
  args: [
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
  ],
};

export const settings = {
  minSize: 45,
  maxPrice: 1500,
  minPrice: 600,
};

// List of all scrapers
// `npm run dev` only runs the first one
export const scrapers = [
  lamberinkScraper,
  solideVastgoedScraper,
  campusGroningenScraper,
  grunoVerhuurScraper,
  bultenvastgoedScaper,
  maxxhurenScraper,
  pandomoScraper,
  groningenVastgoed,
  dcWonenScraper,
  tuitmanvastgoedScraper,
  eentweedrieWonenScraper,
  househuntingScraper,
];
