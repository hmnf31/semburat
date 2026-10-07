import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript's type checker already catches references to undeclared
      // variables (including standard Web/Node globals such as `Response`),
      // and `no-undef` cannot distinguish TS types from real globals. The
      // @typescript-eslint project recommends disabling it for TS files.
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off',
    },
  },
  {
    files: ['**/env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
