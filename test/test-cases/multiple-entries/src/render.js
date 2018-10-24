import React from 'react';
import { renderToString } from 'react-dom/server';

import Welcome from './Welcome';

export default async ({ path }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>hello-world</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="app">${renderToString(<Welcome page={path.name} />)}</div>
        <script type="text/javascript" src="${path.name}"></script>
      </body>
    </html>
  `;
};
