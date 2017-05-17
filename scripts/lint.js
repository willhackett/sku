const chalk = require('chalk');
const baseConfig = require('../config/eslint/eslint.js');
const EslintCLI = require('eslint').CLIEngine;

const cli = new EslintCLI({
  baseConfig,
  useEslintrc: false
});

const formatter = cli.getFormatter();
const report = cli.executeOnFiles(['src']);

console.log(chalk.cyan('Linting'));
console.log(formatter(report.results));

if (report.results.length > 0) {
  process.exit(1);
}
