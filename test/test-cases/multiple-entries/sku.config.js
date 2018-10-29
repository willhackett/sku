module.exports = {
  entry: {
    render: 'src/render.js'
  },
  routes: [
    { name: 'home', entry: 'src/HomePage.js', route: '/' },
    { name: 'details', entry: 'src/DetailsPage.js', route: '/details' }
  ],
  publicPath: '/',
  port: 8080
};
