const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.config');
const builds = require('../config/builds');
const find = require('lodash/find');
const opn = require('opn');

const compiler = webpack(webpackConfig);

module.exports = () =>
  new Promise(resolve => {
    const host = 'http://localhost';
    const port = 8080;
    const url = `${host}:${port}`;

    compiler.watch({}, () => {
      resolve(url);
    });

    const devServer = new WebpackDevServer(compiler, {
      contentBase: builds.map(({ paths }) => paths.public)
    });

    devServer.listen(port, (err, result) => {
      if (err) {
        return console.log(err);
      }

      console.log(chalk.yellow(`Starting the development server on ${url}...`));

      opn(url);
    });
  });
