const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack/webpack.hot.config');

const compiler = webpack(webpackConfig);

export default [
  webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig[0].output.publicPath,
    hot: true
  }),
  webpackHotMiddleware(compiler)
];
