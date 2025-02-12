import chalk from 'chalk';
import fs from 'fs';

const emojis = ['🎉', '🚀', '🔥', '💃', '💅', '😎'];

export function getRandomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}

export function scraperCompletedLog(
  scraper: string,
  error: boolean = false,
): void {
  if (!error)
    console.log(
      chalk.green(
        `${chalk.dim.italic('Completed scraping for:')} ${chalk.bold(scraper)} ${getRandomEmoji()}`,
      ),
    );
  else
    console.log(
      chalk.red(
        `${chalk.dim.italic('Error scraping for:')} ${chalk.bold(scraper)} 🥺`,
      ),
    );
}

// eslint-disable-next-line @typescript-eslint/no-expliciBesteany
export const logErrorToFile = (error: any, logFilePath: string) => {
  try {
    const timestamp = new Date().toISOString();
    const errorMessage = `${timestamp} - Error: ${error.message || error}\nStack: ${error.stack || 'No stack trace available'}\n\n`;
    fs.appendFileSync(logFilePath, errorMessage, 'utf8');
  } catch (error) {
    console.log(error);
  }
};
