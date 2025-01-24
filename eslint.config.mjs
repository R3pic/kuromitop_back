// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
    plugins: {
      '@stylistic/ts': stylisticTs
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@stylistic/ts/indent': ['error', 4],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/member-delimiter-style': 'error'
    },
  },
);