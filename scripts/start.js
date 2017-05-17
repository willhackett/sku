const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack/webpack.config');
const builds = require('../config/builds');
const find = require('lodash/find');
const opn = require('opn');
const nodemon = require('nodemon');
const once = require('lodash/once');

const compiler = webpack(webpackConfig);
// const devServer = new WebpackDevServer(compiler, {
//   contentBase: builds.map(({ paths }) => paths.public)
// });

const startServer = once(options => {
  const server = nodemon({
    execMap: {
      js: 'node'
    },
    script: 'dist/server.js',
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  })
    .once('start', () => {
      console.log('Started!', Date());
      if (options && options.onStart) {
        options.onStart();
      }
    })
    .on('restart', () => {
      console.log('Restarted!', Date());
    });

  process.once('SIGINT', () => {
    server.once('exit', () => {
      process.exit();
    });
  });
});

compiler.watch(
  {
    aggregateTimeout: 300,
    poll: true
  },
  () => {
    startServer();
    nodemon.restart();
  }
);

// const port = 8080;
// devServer.listen(port, (err, result) => {
// if (err) {
// return console.log(err);
// }

// console.log(`Starting the development server on port ${port}...`);
// console.log();

// opn(`http://localhost:${port}`);
// });
