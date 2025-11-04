const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = defineConfig([
  {
    files: ['**/*.config.js'],
    languageOptions: {
      globals: {
        __dirname: true,
        require: true,
        module: true,
      },
    },
  },

  expoConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },

  {
    ignores: ['dist/*', 'node_modules/*', '.expo/', '**/*.config.js'],
  },
]);