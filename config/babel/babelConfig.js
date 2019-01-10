const { supportedBrowsers } = require('../../context');
const { cwd } = require('../../lib/cwd');

const NODE = 'node';
const MODERN_BROWSER = 'modern-browser';
const LEGACY_BROWSER = 'legacy-browser';

const validTargets = [NODE, MODERN_BROWSER, LEGACY_BROWSER];

const getEnvOptions = target =>
  ({
    'legacy-browser': {
      modules: false,
      targets: supportedBrowsers
    },
    'modern-browser': {
      modules: false,
      targets: {
        esmodules: true
      }
    },
    node: {
      targets: {
        node: 'current'
      }
    }
  }[target]);

module.exports = ({ target, lang = 'js', basic = false }) => {
  if (!validTargets.includes(target)) {
    throw new Error(`Invalid babel target: ${target}`);
  }

  const isBrowser = target === LEGACY_BROWSER || target === MODERN_BROWSER;

  if (basic) {
    return {
      babelrc: false,
      presets: [[require.resolve('@babel/preset-env'), getEnvOptions(target)]]
    };
  }

  const plugins = [
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-flow-react-proptypes'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: [cwd()],
        extensions: ['.mjs', '.js', '.json', '.ts', '.tsx']
      }
    ],
    require.resolve('babel-plugin-macros')
  ];

  if (isBrowser) {
    plugins.push(require.resolve('babel-plugin-seek-style-guide'));
  } else {
    plugins.push(require.resolve('babel-plugin-dynamic-import-node'));
  }

  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      require.resolve('@babel/plugin-transform-react-inline-elements'),
      require.resolve('babel-plugin-transform-react-remove-prop-types'),
      require.resolve('@babel/plugin-transform-react-constant-elements')
    );
  }

  const languagePreset =
    lang === 'ts'
      ? [
          require.resolve('@babel/preset-typescript'),
          {
            isTSX: true,
            allExtensions: true
          }
        ]
      : require.resolve('@babel/preset-flow');

  return {
    babelrc: false,
    presets: [
      languagePreset,
      [require.resolve('@babel/preset-env'), getEnvOptions(target)],
      require.resolve('@babel/preset-react')
    ],
    plugins
  };
};
