module.exports = {
  entry: {
    render: 'src/render.js'
  },
  routes: [
    { name: 'page1', entry: 'src/Page1.js', route: '/' },
    { name: 'page2', entry: 'src/Page2.js', route: '/page2' }
  ],
  publicPath: '/',
  port: 8080
};
