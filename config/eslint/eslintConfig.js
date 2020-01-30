const { eslintDecorator } = require('../../context');
const { getPathFromCwd } = require('../../lib/cwd');

const ERROR = 2;

const baseConfig = {
  extends: require.resolve('eslint-config-seek'),
  parserOptions: {
    project: getPathFromCwd('tsconfig.json'),
  },
  overrides: [
    {
      // TypeScript config
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/no-floating-promises': ERROR,
      },
    },
  ],
  rules: {
    'import/order': [
      ERROR,
      {
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: 'src/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [
          {
            pattern: 'src/**',
            group: 'external',
            position: 'after',
          },
        ],
      },
    ],
  },
};

module.exports = eslintDecorator(baseConfig);
