// First, ensure the build is running in production mode
process.env.NODE_ENV = 'production';

const path = require('path');
const { promisify } = require('util');
const fs = require('fs-extra');
const rimraf = promisify(require('rimraf'));
const build = require('../config/builds');
const webpackCompiler = require('../config/webpack/webpack.config');

const runWebpack = () =>
  new Promise((resolve, reject) => {
    webpackCompiler.run((error, stats) => {
      console.log(
        stats.toString({
          chunks: false, // Makes the build much quieter
          children: false,
          colors: true
        })
      );

      if (error || stats.hasErrors()) {
        // Webpack has already printed the errors, so we just need to stop execution.
        reject();
      }

      const info = stats.toJson();

      if (stats.hasWarnings()) {
        info.warnings.forEach(console.warn);
      }

      reject();
    });
  });

const cleanDistFolders = () => rimraf(`${build.paths.dist}/*`);

const cleanRenderJs = () => rimraf(path.join(build.paths.dist, 'render.js'));

const copyPublicFiles = () => {
  if (fs.existsSync(build.paths.public)) {
    fs.copySync(build.paths.public, build.paths.dist, {
      dereference: true
    });
    console.log(`Copying ${build.paths.public} to ${build.paths.dist}`);
  }
};

cleanDistFolders()
  .then(runWebpack)
  .then(cleanRenderJs)
  .then(copyPublicFiles)
  .then(() => console.log('Sku build complete!'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
