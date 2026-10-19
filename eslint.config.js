import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['build/**', 'dist/**', 'node_modules/**', 'coverage/**', 'docs_ignore/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'vite.config.ts', 'vitest.config.ts', 'eslint.config.js'],
    languageOptions: {
      // Browser globals are needed for the code passed to page.evaluate().
      globals: { ...globals.node, ...globals.browser },
    },
  }
);
