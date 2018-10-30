const path = require('path');
const fs = require('fs');
const { uniqWith, isEqual, fromPairs, merge } = require('lodash');

const args = require('./args');
const defaultSkuConfig = require('./defaultSkuConfig');

const cwd = process.cwd();
const buildConfig = require(path.join(cwd, args.config));
const skuConfig = merge(defaultSkuConfig, buildConfig);

const getClientEntries = () => {
  const { routes, entry } = skuConfig;

  // Extract route specific entries
  const clientEntries = routes
    .filter(route => typeof route === 'object' && route.entry && route.name)
    .map(route => [route.name, route.entry]);

  if (fs.existsSync(path.join(cwd, entry.client))) {
    clientEntries.push(['main', entry.client]);
  }

  return fromPairs(
    uniqWith(clientEntries, isEqual).map(([name, entry]) => [
      name,
      path.join(cwd, entry)
    ])
  );
};

const env = Object.assign(
  {
    SKU_TENANT: args.tenant || ''
  },
  skuConfig.env
);

const devPathData = skuConfig.devPathData;

const buildRenderConfig = {
  sites: skuConfig.sites,
  environments: skuConfig.environments,
  routes: skuConfig.routes,
  transformPath: skuConfig.transformPath
};
const startRenderConfig = {
  sites: [devPathData.site],
  environments: [devPathData.environment],
  routes: buildRenderConfig.routes,
  transformPath: skuConfig.devTransformPath
};

const renderConfig =
  args.script === 'start' ? startRenderConfig : buildRenderConfig;

const paths = {
  src: skuConfig.srcPaths.map(srcPath => path.join(cwd, srcPath)),
  compilePackages: [
    'seek-style-guide',
    'seek-asia-style-guide',
    'braid-design-system',
    ...skuConfig.compilePackages
  ],
  clientEntries: getClientEntries(),
  renderEntry: path.join(cwd, skuConfig.entry.render),
  public: path.join(cwd, skuConfig.public),
  publicPath: args.script === 'start' ? '' : skuConfig.publicPath,
  dist: path.join(cwd, skuConfig.target)
};

const build = {
  ...skuConfig,
  webpackDecorator: skuConfig.dangerouslySetWebpackConfig,
  jestDecorator: skuConfig.dangerouslySetJestConfig,
  eslintDecorator: skuConfig.dangerouslySetESLintConfig,
  renderConfig,
  env,
  paths
};

module.exports = build;
