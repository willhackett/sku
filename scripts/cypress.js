const spawn = require('cross-spawn');
const chalk = require('chalk');
const startApp = require('../lib/startApp');
const startMock = require('../lib/startMock');
const cypressConfig = require('../config/cypress/cypress.config');

let mockProcess;

const objectToCmd = config =>
  Object.keys(config).map(key => `${key}=${config[key]}`).join();

const runCypress = (url, stopMock) => {
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
    if (stopMock) {
      stopMock().then(() => {
        process.exit(code);
      });
    } else {
      process.exit(code);
    }
  });
};

Promise.all([startMock(), startApp(false)]).then(([stopMock, url]) =>
  runCypress(url, stopMock));
