import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import dedent from 'dedent';

import App from './App';

export default {
  renderApp: ({ webpackStats, site }) => {
    const extractor = new ChunkExtractor({ statsFile: webpackStats });

    const jsx = extractor.collectChunks(<App theme={site} />);

    const scriptTags = extractor.getScriptTags();

    return {
      extraScriptTags: scriptTags,
      html: renderToString(jsx)
    };
  },

  renderDocument: ({ app, headTags, bodyTags }) => dedent`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>My Awesome Project</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${headTags}
      </head>
      <body>
        <div id="app">${app.html}</div>
        ${app.extraScriptTags}
        ${bodyTags}
      </body>
    </html>
  `
};
