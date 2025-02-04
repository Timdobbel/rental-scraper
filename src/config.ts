import { LaunchOptions } from 'puppeteer';

export const launchOptions: LaunchOptions = {
  headless: process.env.NODE_ENV === 'development' ? false : true,
  slowMo: 0,
};

export const settings = {
  minSize: 45,
  maxPrice: 1500,
};
