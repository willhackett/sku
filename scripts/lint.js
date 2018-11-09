const Listr = require('listr');
const baseESlintConfig = require('eslint-config-seek');
const EslintCLI = require('eslint').CLIEngine;
const builds = require('../config/builds');
const isTypeScript = require('../lib/isTypeScript');
const prettierCheck = require('../lib/runPrettier').check;
const runTsc = require('../lib/runTsc');
const runTSLint = require('../lib/runTSLint');

const args = require('../config/args').argv;

// console.log(chalk.cyan('Linting'));

const tasks = new Listr(
  [
    {
      title: 'TypeScript',
      enabled: ({ ts }) => ts,
      task: () =>
        new Listr(
          [
            { title: 'Type check', task: () => runTsc() },
            { title: 'TSLint', task: () => runTSLint() }
          ],
          { concurrent: true }
        )
    },
    {
      title: 'ESLint',
      task: () => {
        // Decorate eslint config is not supported for monorepo
        const eslintConfig =
          builds.length === 1
            ? builds[0].eslintDecorator(baseESlintConfig)
            : baseESlintConfig;

        const cli = new EslintCLI({
          baseConfig: eslintConfig,
          useEslintrc: false
        });

        const pathsToCheck = args.length === 0 ? builds[0].paths.src : args;

        const formatter = cli.getFormatter();
        const report = cli.executeOnFiles(pathsToCheck);

        // console.log(formatter(report.results));

        return report.errorCount > 0 ? Promise.reject() : Promise.resolve();
      }
    },
    {
      title: 'Prettier',
      task: () => prettierCheck()
    }
  ],
  { concurrent: true }
);

tasks
  .run({
    ts: isTypeScript()
  })
  .catch(e => {
    process.exit(1);
  });

// Decorate eslint config is not supported for monorepo
// const eslintConfig =
//   builds.length === 1
//     ? builds[0].eslintDecorator(baseESlintConfig)
//     : baseESlintConfig;

// const cli = new EslintCLI({
//   baseConfig: eslintConfig,
//   useEslintrc: false
// });

// const pathsToCheck = args.length === 0 ? builds[0].paths.src : args;

// const formatter = cli.getFormatter();
// console.log(chalk.gray(`eslint ${pathsToCheck.join(' ')}`));
// const report = cli.executeOnFiles(pathsToCheck);

// console.log(formatter(report.results));

// if (report.errorCount > 0) {
//   process.exit(1);
// }

// await prettierCheck();
