import fs from 'fs';

export const getFileContent = () => {};

export const writeFileContent = (properties) => {
  fs.writeFileSync('results.json', JSON.stringify(properties, null, 2));
};
