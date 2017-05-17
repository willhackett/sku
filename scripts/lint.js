const path = require('path');
const chalk = require('chalk');
const baseConfig = require('../config/eslint/.eslint.js');
const EslintCLI = require('eslint').CLIEngine;

const lintPaths = {
  app: {
    config: '../config/eslint/eslint.app.js',
    ignorePattern: '**/*.test.js',
    glob: ['src']
  },
  test: {
    config: '../config/eslint/eslint.test.js',
    glob: ['**/*.test.js']
  }
};

const lintCode = ({ config, ignorePattern, glob }) => {
  const cli = new EslintCLI({
    baseConfig: baseConfig,
    configFile: path.join(__dirname, config),
    ignorePattern,
    useEslintrc: false
  });

  const formatter = cli.getFormatter();
  const report = cli.executeOnFiles(glob);

  console.log(formatter(report.results));

  if (report.results.length > 0) {
    process.exit(1);
  }
};

console.log(chalk.cyan('Linting App'));
lintCode(lintPaths.app);

console.log(chalk.cyan('Linting Tests'));
lintCode(lintPaths.test);
