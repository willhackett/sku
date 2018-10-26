process.env.NODE_ENV = 'development';

const WebpackDevServer = require('webpack-dev-server');
const webpackCompiler = require('../config/webpack/webpack.config');
const { hosts, port, initialPath, paths } = require('../config/build');
const opn = require('opn');

const devServer = new WebpackDevServer(webpackCompiler, {
  contentBase: paths.public,
  overlay: true,
  stats: 'errors-only',
  allowedHosts: hosts
});

devServer.listen(port, '0.0.0.0', (err, result) => {
  if (err) {
    return console.log(err);
  }

  const url = `http://${hosts[0]}:${port}${initialPath}`;

  console.log();
  console.log(`Starting the development server on ${url}...`);
  console.log();

  if (process.env.OPEN_TAB !== 'false') {
    opn(url);
  }
});
