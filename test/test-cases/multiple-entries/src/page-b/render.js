import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export default ({ publicPath }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>hello-world</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="${publicPath}page-b/index.css" />
    </head>
    <body>
      <div id="app">${renderToString(<App />)}</div>
      <script type="text/javascript" src="${publicPath}page-b/index.js"></script>
    </body>
  </html>
`;
