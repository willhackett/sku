const cwd = process.cwd();
const path = require('path');
const fs = require('fs');
const { uniqWith, isEqual, fromPairs, get } = require('lodash');
const args = require('./args');
const buildConfig = require(path.join(cwd, args.config));

const defaultDecorator = a => a;

const defaultPathData = {
  // locale: ['AU', "NZ"],
  // brand: ['seek'],
  // language: ['en-au'],
  sites: ['au'],
  environments: ['production'],
  paths: ['/']
};
const defaultDevPathData = {
  site: 'au',
  environment: 'development'
};

const defaultTransformPath = pathData =>
  `${pathData.environment}/${pathData.site}/${get(
    pathData.path,
    'path',
    pathData.path
  )}/index.html`;

const defaultDevTransformPath = pathData => `${pathData.path}/index.html`;

const getClientEntries = (paths, entry) => {
  // Extract path specific entries
  const clientEntries = paths
    .filter(path => typeof path === 'object' && path.entry && path.name)
    .map(path => [path.name, path.entry]);

  if (entry.client) {
    clientEntries.push(['main', entry.client]);
  }

  if (clientEntries.length === 0) {
    // Default entry when no others are specified
    clientEntries.push(['main', 'src/client.js']);
  }

  // Remove duplicates and resolve to pull paths
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

const appPaths = buildConfig.paths || defaultPathData.paths;
const devPathData = buildConfig.devPathData || defaultDevPathData;
const transformPath = buildConfig.transformPath || defaultTransformPath;
const devTransformPath =
  buildConfig.devTransformPath || defaultDevTransformPath;

const renderConfig = {
  pathData: {
    sites: buildConfig.sites || defaultPathData.sites,
    environments: buildConfig.environments || defaultPathData.environments,
    paths: buildConfig.paths || defaultPathData.paths
  },
  devPathData,
  transformPath,
  devTransformPath
};

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
  clientEntries: getClientEntries(appPaths, entry),
  renderEntry: path.join(cwd, entry.render || 'src/render.js'),
  public: path.join(cwd, buildConfig.public || 'public'),
  publicPath: buildConfig.publicPath || '/',
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
