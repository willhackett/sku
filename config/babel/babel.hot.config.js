module.exports = ({ webpack }) => {
  const es2015Options = webpack ? { modules: false } : {};
  const plugins = [
    'babel-plugin-transform-class-properties',
    'babel-plugin-transform-object-rest-spread',
    [
      'babel-plugin-module-resolver',
      {
        root: [process.cwd()]
      }
    ],
    'react-hot-loader/babel'
  ];

  if (webpack) {
    // plugins.push([
    //   require('babel-plugin-transform-imports'),
    //   {
    //     'seek-style-guide/react': {
    //       transform: 'seek-style-guide/react/${member}/${member}',
    //       preventFullImport: true
    //     }
    //   }
    // ]);
  }

  return {
    babelrc: false,
    presets: [['babel-preset-es2015', es2015Options], 'babel-preset-react'],
    plugins
    // env: {
    //   production: {
    //     presets: ['babel-preset-react-optimize']
    //   }
    // }
  };
};
