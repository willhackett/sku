// First, ensure the build is running in production mode
process.env.NODE_ENV = 'production';

const { green, red } = require('chalk');
const webpack = require('webpack');

const makeWebpackConfig = require('../config/webpack/webpack.config.ssr');
const { port } = require('../context');
const {
  copyPublicFiles,
  cleanTargetDirectory,
  ensureTargetDirectory,
} = require('../lib/buildFileUtils');
const { run } = require('../lib/runWebpack');

(async () => {
  try {
    const [clientConfig, serverConfig] = makeWebpackConfig({
      clientPort: port.client,
      serverPort: port.server,
    });
    await ensureTargetDirectory();
    await cleanTargetDirectory();
    await run(webpack(clientConfig));
    await run(webpack(serverConfig));
    await copyPublicFiles();

    console.log(green('Sku build complete!'));
  } catch (e) {
    console.error(red(e));

    process.exit(1);
  }
})();
