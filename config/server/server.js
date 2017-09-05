const express = require('express');
const {
  renderCallback,
  middleware
} = require('__sku_alias__serverEntry').default;
const webpackMiddleware = require('./webpack').default;
const port = process.env.PORT || 8080;

const app = express();

if (true) {
  app.use(webpackMiddleware);
}

app.use(express.static(require('path').join(__dirname, './')));

if (middleware) {
  app.use(middleware);
}

app.get('*', renderCallback);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
