const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const lodash = require('lodash');
const debug = require('debug')('sku:webpack');
const build = require('../build');
const args = require('../args');
const bundleAnalyzerPlugin = require('./plugins/bundleAnalyzer');
const utils = require('./utils');
const staticRenderPlugin = require('./plugins/staticRenderPlugin');

const webpackMode = utils.isProductionBuild ? 'production' : 'development';

const { name, paths, env, locales, webpackDecorator, port, polyfills } = build;

console.log({
  name,
  paths,
  env,
  locales,
  webpackDecorator,
  port,
  polyfills
});
const envVars = lodash
  .chain(env)
  .mapValues((value, key) => {
    if (typeof value !== 'object') {
      return JSON.stringify(value);
    }

    const valueForEnv = value[args.env];

    if (typeof valueForEnv === 'undefined') {
      console.log(
        `WARNING: Environment variable "${key}" for build "${name}" is missing a value for the "${
          args.env
        }" environment`
      );
      process.exit(1);
    }

    return JSON.stringify(valueForEnv);
  })
  .set('SKU_ENV', JSON.stringify(args.env))
  .set('PORT', JSON.stringify(port))
  .mapKeys((value, key) => `process.env.${key}`)
  .value();

const resolvedPolyfills = polyfills.map(polyfill => {
  return require.resolve(polyfill, { paths: [process.cwd()] });
});

const devServerEntries = [
  `${require.resolve('webpack-dev-server/client')}?http://localhost:${port}/`
];

// Add polyfills and dev server client to all entries
const entries = lodash.mapValues(
  paths.clientEntries,
  entry =>
    args.script === 'start'
      ? [...resolvedPolyfills, ...devServerEntries, entry]
      : [...resolvedPolyfills, entry]
);

const internalJs = [
  ...paths.src,
  ...paths.compilePackages.map(utils.resolvePackage)
];

debug({ build: name || 'default', internalJs });

const publicPath = args.script === 'start' ? '/' : paths.publicPath;

const result = [
  {
    name: 'client',
    mode: webpackMode,
    entry: entries,
    output: {
      path: paths.dist,
      publicPath,
      filename: '[name].js'
    },
    optimization: {
      nodeEnv: process.env.NODE_ENV,
      minimize: utils.isProductionBuild,
      concatenateModules: utils.isProductionBuild,
      splitChunks: {
        chunks: 'all'
      }
    },
    module: {
      rules: [
        {
          test: /(?!\.css)\.js$/,
          include: internalJs,
          use: utils.makeJsLoaders({ target: 'browser' })
        },
        {
          test: /(?!\.css)\.js$/,
          exclude: internalJs,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                presets: [
                  [require.resolve('@babel/preset-env'), { modules: false }]
                ]
              }
            }
          ]
        },
        {
          test: /\.css\.js$/,
          use: [MiniCssExtractPlugin.loader].concat(
            utils.makeCssLoaders({ js: true })
          )
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.less$/,
          oneOf: [
            ...paths.compilePackages.map(packageName => ({
              include: utils.resolvePackage(packageName),
              use: [MiniCssExtractPlugin.loader].concat(
                utils.makeCssLoaders({ packageName })
              )
            })),
            {
              exclude: /node_modules/,
              use: [MiniCssExtractPlugin.loader].concat(utils.makeCssLoaders())
            }
          ]
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: utils.makeImageLoaders()
        },
        {
          test: /\.svg$/,
          use: utils.makeSvgLoaders()
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      bundleAnalyzerPlugin({ name: 'client' }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css'
      })
    ]
  },
  {
    name: 'render',
    mode: 'development',
    entry: {
      render: paths.renderEntry
    },
    target: 'node',
    externals: [
      // Don't bundle or transpile non-compiled packages
      nodeExternals({
        // webpack-node-externals compares the `import` or `require` expression to this list,
        // not the package name, so we map each packageName to a pattern. This ensures it
        // matches when importing a file within a package e.g. import { Text } from 'seek-style-guide/react'.
        whitelist: paths.compilePackages.map(
          packageName => new RegExp(`^(${packageName})`)
        )
      })
    ],
    output: {
      path: paths.dist,
      publicPath,
      filename: 'render.js',
      libraryExport: 'default',
      library: 'static',
      libraryTarget: 'umd2'
    },
    module: {
      rules: [
        {
          test: /(?!\.css)\.js$/,
          include: internalJs,
          use: utils.makeJsLoaders({ target: 'node' })
        },
        {
          test: /\.css\.js$/,
          use: utils.makeCssLoaders({ server: true, js: true })
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        },
        {
          test: /\.less$/,
          oneOf: [
            ...paths.compilePackages.map(packageName => ({
              include: utils.resolvePackage(packageName),
              use: utils.makeCssLoaders({ server: true, packageName })
            })),
            {
              exclude: /node_modules/,
              use: utils.makeCssLoaders({ server: true })
            }
          ]
        },

        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          use: utils.makeImageLoaders({ server: true })
        },
        {
          test: /\.svg$/,
          use: utils.makeSvgLoaders()
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envVars),
      bundleAnalyzerPlugin({ name: 'render' })
    ]
  }
].map(webpackDecorator);

debug(JSON.stringify(result));

const compiler = webpack(result);
compiler.apply(staticRenderPlugin());

module.exports = compiler;
