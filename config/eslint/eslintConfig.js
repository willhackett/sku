const { eslintDecorator } = require('../../context');

const ERROR = 2;

module.exports.baseConfig = {
  extends: require.resolve('eslint-config-seek'),
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
