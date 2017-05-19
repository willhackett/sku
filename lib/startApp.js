const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.config');
const builds = require('../config/builds');
const find = require('lodash/find');
const once = require('lodash/once');
const opn = require('opn');

const compiler = webpack(webpackConfig);

module.exports = (openTab = true) =>
  new Promise(resolve => {
    const host = 'http://localhost';
    const port = 8080;
    const url = `${host}:${port}`;
    const finishInit = once(() => {
      if (openTab) {
        opn(url);
      }

      resolve(url);
    });

    compiler.plugin('done', finishInit);

    const devServer = new WebpackDevServer(compiler, {
      contentBase: builds.map(({ paths }) => paths.public),
      stats: 'errors-only'
    });

    devServer.listen(port, (err, result) => {
      if (err) {
        return console.log(err);
      }

      console.log(chalk.yellow(`Starting the development server on ${url}...`));
    });
  });
