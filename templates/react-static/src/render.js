import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App/App';

export default () =>
  `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>My Awesome Project</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="${process.env.STATIC_RESOURCE_PATH}style.css" />
    </head>
    <body>
      <div id="app">${renderToString(<App />)}</div>
      <script type="text/javascript" src="${process.env.STATIC_RESOURCE_PATH}main.js"></script>
    </body>
  </html>
`;
