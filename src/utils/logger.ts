import chalk from 'chalk';

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

export function scraperLog(message: string) {
  console.log();
}
