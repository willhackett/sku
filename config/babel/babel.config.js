module.exports = {
  babelrc: false,
  presets: [
    [
      require.resolve('babel-preset-es2015'),
      {
        modules: false
      }
    ],
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    [
      require.resolve('babel-plugin-transform-imports'),
      {
        'seek-style-guide/react': {
          transform: 'seek-style-guide/react/${member}/${member}',
          preventFullImport: true
        }
      }
    ],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src']
      }
    ]
  ],
  env: {
    production: {
      presets: [require.resolve('babel-preset-react-optimize')]
    }
  }
};
