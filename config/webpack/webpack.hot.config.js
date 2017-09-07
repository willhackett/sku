const webpack = require('webpack');
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const builds = require('../builds');
const lodash = require('lodash');
const flatten = require('lodash/flatten');
const args = require('../args');
const path = require('path');
const isProductionBuild = process.env.NODE_ENV === 'production';

const jsLoaders = [
  {
    loader: 'babel-loader',
    options: require('../babel/babel.hot.config')({ webpack: true })
  }
];

const packageToClassPrefix = name =>
  `__${name.match(/([^\/]*)$/)[0].toUpperCase().replace(/[\/\-]/g, '_')}__`;

const makeCssLoaders = (options = {}) => {
  const { server = false, package = '', js = false } = options;
  const debugIdent = isProductionBuild
    ? ''
    : `${package ? packageToClassPrefix(package) : ''}[name]__[local]___`;

  const cssInJsLoaders = [{ loader: 'css-in-js-loader' }, ...jsLoaders];

  return (cssLoaders = [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: `${debugIdent}[hash:base64:7]`,
        minimize: isProductionBuild,
        importLoaders: 3
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: () => [
          require('autoprefixer')({
            browsers: [
              '> 1%',
              'Last 2 versions',
              'ie >= 10',
              'Safari >= 8',
              'iOS >= 8'
            ]
          })
        ]
      }
    },
    {
      loader: 'less-loader'
    },
    {
      // Hacky fix for https://github.com/webpack-contrib/css-loader/issues/74
      loader: 'string-replace-loader',
      options: {
        search: '(url\\([\'"]?)(.)',
        replace: '$1\\$2',
        flags: 'g'
      }
    },
    ...(js ? cssInJsLoaders : [])
  ]);
};

const makeImageLoaders = (options = {}) => {
  const { server = false } = options;

  return [
    {
      loader: 'url-loader',
      options: {
        limit: server ? 999999999 : 10000
      }
    }
  ];
};

const svgLoaders = [
  {
    loader: 'raw-loader'
  },
  {
    loader: 'svgo-loader',
    options: {
      plugins: [
        {
          addAttributesToSVGElement: {
            attribute: 'focusable="false"'
          }
        }
      ]
    }
  }
];

const buildWebpackConfigs = builds.map(
  ({ name, paths, env, locales, webpackDecorator, port }) => {
    const envVars = lodash
      .chain(env)
      .mapValues((value, key) => {
        if (typeof value !== 'object') {
          return JSON.stringify(value);
        }

        const valueForEnv = value[args.env];

        if (typeof valueForEnv === 'undefined') {
          console.log(
            `WARNING: Environment variable "${key}" for build "${name}" is missing a value for the "${args.env}" environment`
          );
          process.exit(1);
        }

        return JSON.stringify(valueForEnv);
      })
      .set('SKU_ENV', JSON.stringify(args.env))
      .set('PORT', JSON.stringify(port))
      .mapKeys((value, key) => `process.env.${key}`)
      .value();

    const internalJs = [paths.src, ...paths.compilePackages];

    const entry = [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      paths.clientEntry
    ];

    return [
      {
        entry,
        output: {
          path: paths.dist,
          filename: '[name].hot.js'
        },
        module: {
          rules: [
            {
              test: /(?!\.css)\.js$/,
              include: internalJs,
              use: jsLoaders
            },
            {
              test: /(?!\.css)\.js$/,
              exclude: internalJs,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    babelrc: false,
                    presets: [require('babel-preset-es2015')]
                  }
                }
              ]
            },
            {
              test: /\.css\.js$/,
              use: makeCssLoaders({ js: true })
            },
            {
              test: /\.less$/,
              exclude: /node_modules/,
              use: makeCssLoaders()
            },
            ...paths.compilePackages.map(package => ({
              test: /\.less$/,
              include: package,
              use: makeCssLoaders({ package })
            })),
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              use: makeImageLoaders()
            },
            {
              test: /\.svg$/,
              use: svgLoaders
            }
          ]
        },
        plugins: [
          new webpack.DefinePlugin(envVars),
          //   new ExtractTextPlugin('style.css'),
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.LoaderOptionsPlugin({
            debug: true
          })
        ].concat(
          !isProductionBuild
            ? [
                //new webpack.HotModuleReplacementPlugin()
              ]
            : [
                // new webpack.optimize.UglifyJsPlugin(),
                // new webpack.DefinePlugin({
                //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
                // }),
                // new webpack.optimize.ModuleConcatenationPlugin()
              ]
        )
      }
    ].map(webpackDecorator);
  }
);

module.exports = flatten(buildWebpackConfigs);
