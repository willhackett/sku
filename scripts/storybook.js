const path = require('path');

const { argv } = require('../config/args');
const { storybookPort } = require('../context');
const gracefulSpawn = require('../lib/gracefulSpawn');
const startStorybookPath = require.resolve('@storybook/react/bin/index.js');
const configDir = path.resolve(__dirname, '..', 'config', 'storybook', 'start');

argv.push('--port', storybookPort);
argv.push('--config-dir', configDir);

const storybookProcess = gracefulSpawn(startStorybookPath, argv, {
  stdio: 'inherit',
  env: process.env,
});

storybookProcess.on('exit', exitCode => {
  process.exit(exitCode);
});
