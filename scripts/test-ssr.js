/* eslint-disable-next-line jest/no-jest-import */
const jest = require('jest');

const { argv } = require('../config/args');
const baseJestConfig = require('../config/jest/jestConfig');
const { jestDecorator } = require('../context');

const jestConfig = jestDecorator(baseJestConfig);

if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

argv.push('--config', JSON.stringify(jestConfig));

jest.run(argv);
