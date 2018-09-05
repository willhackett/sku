module.exports = {
pages: {
    'page-a/index': {
      client: 'src/page-a/client.js',
      render: 'src/page-a/render.js'
    },
    'page-b/index': {
      client: 'src/page-b/client.js',
      render: 'src/page-b/render.js'
    }
  },
  target: 'dist',
  publicPath: '/',
  port: 8080
};
