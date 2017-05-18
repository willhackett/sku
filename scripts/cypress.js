const spawn = require('cross-spawn');
const chalk = require('chalk');
const startApp = require('../lib/startApp');
const startMock = require('../lib/startMock');
const cypressConfig = require('../config/cypress/cypress.config');

const objectToCmd = config =>
  Object.keys(config).map(key => `${key}=${config[key]}`).join();

const runCypress = url => {
  console.log(chalk.white('Starting cypress tests...'));
  const cypressBin = require.resolve('cypress-cli/bin/cypress');

  const env = {
    url
  };

  const child = spawn(
    cypressBin,
    ['run', '--config', objectToCmd(cypressConfig), '--env', objectToCmd(env)],
    { stdio: 'inherit' }
  );

  child.on('close', code => {
    process.exit(code);
  });
};

startMock().then(() => startApp(false)).then(runCypress);
