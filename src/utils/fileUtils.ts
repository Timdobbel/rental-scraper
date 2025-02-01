import fs from 'fs';
import chalk from 'chalk';
import { sendEmail } from './mailUtils';
import { getRandomEmoji } from './logger';

export type Properties = {
  title: string;
  status: string;
}[];

export const compareAndWrite = (folderName: string, properties: Properties) => {
  const existingData = getFileContent(folderName);
  const path = `./src/scrapers/${folderName}/results.json`;

  if (!existingData) {
    console.log(
      chalk.yellow(`[${folderName}] No existing data found. Writing new file.`),
    );
    writeFileContent(folderName, properties);
    return;
  }

  let hasChanges = false;
  const existingTitles = new Set(existingData.map((item) => item.title));
  const newTitles = new Set(properties.map((item) => item.title));

  const removedEntries = existingData.filter(
    (item) => !newTitles.has(item.title),
  );
  const addedEntries = properties.filter(
    (item) => !existingTitles.has(item.title),
  );

  let emailContent = '';

  if (removedEntries.length > 0 || addedEntries.length > 0) {
    hasChanges = true;
    removedEntries.forEach((item) => {
      const message = `Verwijderd: ${item.title} (Status: ${item.status})`;
      console.log(chalk.red(`[${folderName}] ${message}`));
      emailContent += `${message}\n`;
    });
    addedEntries.forEach((item) => {
      const message = `Toegevoegd: ${item.title} (Status: ${item.status})`;
      console.log(chalk.green(`[${folderName}] ${message}`));
      emailContent += `${message}\n`;
    });
  }

  for (let i = 0; i < properties.length; i++) {
    const existingItem = existingData.find(
      (item) => item.title === properties[i].title,
    );
    if (existingItem && existingItem.status !== properties[i].status) {
      const message = `Wijziging in de volgende woning:
        - Title: ${properties[i].title}
        - Status: ${existingItem.status} -> ${properties[i].status}`;
      console.log(chalk.blue(`[${folderName}] ${message}`));
      emailContent += `${message}\n`;
      hasChanges = true;
    }
  }

  if (hasChanges) {
    console.log(
      chalk.green(`[${folderName}] Changes detected. Updating file: ${path}`),
    );
    writeFileContent(folderName, properties);
    sendEmail(
      emailContent,
      `Verandering op website van ${folderName.toLowerCase()}! ${getRandomEmoji()}`,
    );
  } else {
    console.log(
      chalk.gray(
        `[${folderName}] No changes detected. File remains unchanged.`,
      ),
    );
  }
};

export const getFileContent = (folderName: string) => {
  const path = `./src/scrapers/${folderName}/results.json`;

  try {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data) as Properties;
  } catch {
    console.log(
      chalk.redBright(
        `[${folderName}] ${chalk.italic('Error reading file from:')} ${chalk.bold(path)}`,
      ),
    );
    return null;
  }
};

export const writeFileContent = (
  /**
   * Used for the path to write file to.
   *
   * Example:  **campusGroningen**
   * Equals: **./src/campusGroningen/results.json**
   */
  folderName: string,
  properties: Properties,
) => {
  const path = `./src/scrapers/${folderName}/results.json`;

  try {
    fs.writeFileSync(path, JSON.stringify(properties, null, 2));
  } catch {
    console.log(
      chalk.redBright(
        `[${folderName}] ${chalk.italic('Error trying to write file to:')} ${chalk.bold(path)}`,
      ),
    );
  }
};
