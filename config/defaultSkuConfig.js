const path = require('path');

const defaultDecorator = a => a;

module.exports = {
  entry: {
    client: 'src/client.js',
    render: 'src/render.js'
  },
  srcPaths: ['./src'],
  sites: ['au'],
  environments: ['production'],
  routes: ['/'],
  devPathData: {
    site: 'au',
    environment: 'production'
  },
  env: {},
  compilePackages: [],
  hosts: ['localhost'],
  port: 8080,
  target: 'dist',
  storybookPort: 8081,
  initialPath: '/',
  public: 'public',
  publicPath: '/',
  polyfills: [],
  dangerouslySetWebpackConfig: defaultDecorator,
  dangerouslySetJestConfig: defaultDecorator,
  dangerouslySetESLintConfig: defaultDecorator,
  transformPath: ({ environment, site, route }) =>
    path.join(environment, site, route),
  devTransformPath: ({ route }) => route
};
