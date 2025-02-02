import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const resultsFilePath = path.join(__dirname, "../../results.json");

const loadResults = (): Record<string, any> => {
  if (fs.existsSync(resultsFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(resultsFilePath, "utf8"));
    } catch (error) {
      console.error("Error reading results file:", error);
      return {};
    }
  }
  return {};
};

const saveResults = (scraperName: string, newResults: any[]) => {
  const results = loadResults();
  results[scraperName] = newResults;
  fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
  console.log(`Results for ${scraperName} updated.`);
};

export const campusScraper = async () => {
  console.log("Running campus scraper...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(
    "https://www.campusgroningen.com/huren-groningen/appartement-huren-groningen",
    { waitUntil: "domcontentloaded" }
  );

  const links = await page.$$eval(".row.matchheight-container a", (anchors) =>
    anchors.map((a) => a.href)
  );
  const results: { link: string; status: string }[] = [];

  for (const link of links) {
    const newPage = await browser.newPage();
    await newPage.goto(link, { waitUntil: "domcontentloaded" });

    try {
      const status = await newPage.$eval(
        ".table.table-condensed button",
        (button) => button.innerText.trim()
      );
      if (status === "Deelnemen" || status === "Volgeboekt") {
        results.push({ link, status });
      }
    } catch (error) {
      console.warn(`No status button found for ${link}`);
    }

    await newPage.close();
  }

  await browser.close();

  saveResults("campus", results);
  return results;
};
