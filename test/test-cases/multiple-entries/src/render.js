import React from 'react';
import { renderToString } from 'react-dom/server';

import HomePage from './handlers/Home';
import DetailsPage from './handlers/Details';

const pageMap = {
  home: HomePage,
  details: DetailsPage
};

export default ({ routeName, bodyTags, headTags }) => {
  const App = pageMap[routeName];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>hello-world</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${headTags}
      </head>
      <body>
        <div id="app">${renderToString(<App />)}</div>
        ${bodyTags}
      </body>
    </html>
  `;
};
