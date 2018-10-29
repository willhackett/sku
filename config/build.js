const cwd = process.cwd();
const path = require('path');
const { uniqWith, isEqual, fromPairs } = require('lodash');
const args = require('./args');
const buildConfig = require(path.join(cwd, args.config));

const defaultDecorator = a => a;

const defaultPathData = {
  sites: ['au'],
  environments: ['production']
};

const defaultTransformPath = ({ environment, site, route }) =>
  path.join(environment, site, route);

const defaultDevTransformPath = ({ route }) => route;

const getClientEntries = (routes, entry) => {
  // Extract route specific entries
  const clientEntries = routes
    .filter(route => typeof route === 'object' && route.entry && route.name)
    .map(route => [route.name, route.entry]);

  if (entry.client) {
    clientEntries.push(['main', entry.client]);
  }

  if (clientEntries.length === 0) {
    // Default entry when no others are specified
    clientEntries.push(['main', 'src/client.js']);
  }

  return fromPairs(
    uniqWith(clientEntries, isEqual).map(([name, entry]) => [
      name,
      path.join(cwd, entry)
    ])
  );
};

const name = buildConfig.name || '';
const env = Object.assign(
  {
    SKU_TENANT: args.tenant || ''
  },
  buildConfig.env || {}
);
const entry = buildConfig.entry || {};
const locales = buildConfig.locales || [''];
const compilePackages = buildConfig.compilePackages || [];
const hosts = buildConfig.hosts || ['localhost'];
const port = buildConfig.port || 8080;
const storybookPort = buildConfig.storybookPort || 8081;
const initialPath = buildConfig.initialPath || '/';

const polyfills = buildConfig.polyfills || [];

const webpackDecorator =
  buildConfig.dangerouslySetWebpackConfig || defaultDecorator;
const jestDecorator = buildConfig.dangerouslySetJestConfig || defaultDecorator;
const eslintDecorator =
  buildConfig.dangerouslySetESLintConfig || defaultDecorator;

const appRoutes = buildConfig.routes || defaultPathData.routes;
const devPathData = buildConfig.devPathData || {};

const buildRenderConfig = {
  sites: buildConfig.sites || defaultPathData.sites,
  environments: buildConfig.environments || defaultPathData.environments,
  routes: buildConfig.routes || defaultPathData.routes,
  transformPath: buildConfig.transformPath || defaultTransformPath
};
const startRenderConfig = {
  sites: [devPathData.site || buildRenderConfig.sites[0]],
  environments: [devPathData.environment || buildRenderConfig.environments[0]],
  routes: buildRenderConfig.routes,
  transformPath: buildConfig.devTransformPath || defaultDevTransformPath
};

const renderConfig =
  args.script === 'start' ? startRenderConfig : buildRenderConfig;

const paths = {
  src: (buildConfig.srcPaths || ['src']).map(srcPath =>
    path.join(cwd, srcPath)
  ),
  compilePackages: [
    'seek-style-guide',
    'seek-asia-style-guide',
    'braid-design-system',
    ...compilePackages
  ],
  clientEntries: getClientEntries(appRoutes, entry),
  renderEntry: path.join(cwd, entry.render || 'src/render.js'),
  public: path.join(cwd, buildConfig.public || 'public'),
  publicPath: args.script === 'start' ? '' : buildConfig.publicPath || '/',
  dist: path.join(cwd, buildConfig.target || 'dist')
};

const build = {
  name,
  renderConfig,
  env,
  paths,
  locales,
  webpackDecorator,
  jestDecorator,
  eslintDecorator,
  hosts,
  port,
  storybookPort,
  polyfills,
  initialPath
};

module.exports = build;
