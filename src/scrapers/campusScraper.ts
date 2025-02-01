import puppeteer from 'puppeteer';

export const campusScraper = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    'https://www.campusgroningen.com/huren-groningen/appartement-huren-groningen',
  );

  // Add your scraping logic here

  await browser.close();
};
