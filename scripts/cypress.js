const spawn = require('cross-spawn');

const objectToCypressConfig = config =>
  Object.keys(config).map(key => `${key}=${config[key]}`).join();

const cypressBin = require.resolve('cypress-cli/bin/cypress');

const config = {
  watchForFileChanges: false,
  chromeWebSecurity: false,
  fixturesFolder: 'test/cypress/fixtures',
  integrationFolder: 'test/cypress/integration',
  // supportFile: 'test/cypress/support',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos'
};

const result = spawn.sync(
  cypressBin,
  ['run', '--config', objectToCypressConfig(config)],
  { stdio: 'inherit' }
);

process.exit(result);
