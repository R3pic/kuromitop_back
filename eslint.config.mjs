// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@stylistic/indent': ['error', 4],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/member-delimiter-style': 'error',
      '@stylistic/array-bracket-newline': ["error", { "multiline": true, "minItems": 3 }],
      '@stylistic/array-bracket-spacing': ['error', "always", { "singleValue": false }],
      '@stylistic/array-element-newline': ["error", "consistent"],
      '@stylistic/arrow-parens': ["error", "always"],
      '@stylistic/arrow-spacing': ["error", { "before": true, "after": true }],
      '@stylistic/block-spacing': "error",
      '@stylistic/brace-style': "error",
      '@stylistic/comma-dangle': ["error", "always-multiline"],
      '@stylistic/comma-spacing': ["error"],
      '@stylistic/max-len': ["error", { "code": 120, "ignoreTemplateLiterals": true }],
      '@stylistic/newline-per-chained-call': ["error", { "ignoreChainWithDepth": 2 }],
      '@stylistic/object-curly-newline': ["error", { 
        "ImportDeclaration": {
          "minProperties": 3,
        },                                 
      }],
      '@stylistic/object-curly-spacing': ["error", "always"]
    },
  },
);