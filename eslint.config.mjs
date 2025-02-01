import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // Disable ESLint rules that conflict with Prettier
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error', // Ensure Prettier formatting is enforced
    },
  },
];
