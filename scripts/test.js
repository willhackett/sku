const jest = require('jest');
const baseJestConfig = require('../config/jest/jestConfig');
const { argv } = require('../config/args');
const { jestDecorator } = require('../config/build');

const jestConfig = jestDecorator
  ? jestDecorator(baseJestConfig)
  : baseJestConfig;

argv.push('--config', JSON.stringify(jestConfig));

jest.run(argv);
