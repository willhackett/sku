module.exports = {
  entry: {
    render: 'src/render.js'
  },
  paths: [
    { name: 'page1', entry: 'src/Page1.js', path: '/' },
    { name: 'page2', entry: 'src/Page2.js', path: '/page2' }
  ],
  pathData: {},
  target: 'dist',
  publicPath: '/',
  port: 8080
};
