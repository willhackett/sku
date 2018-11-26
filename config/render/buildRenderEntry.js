/* eslint-disable import/no-unresolved */
const path = require('path');
const statsFile = path.resolve('./dist/loadable-stats.json');
import { ChunkExtractor } from '@loadable/server';

// __sku_alias__renderEntry is a webpack alias
// pointing to the consuming apps render entry
import render from '__sku_alias__renderEntry';

export default async ({ headTags, bodyTags, ...renderParams }) => {
  const extractor = new ChunkExtractor({ statsFile });

  const app = await render.renderApp({ ...renderParams, extractor });

  return await render.renderDocument({
    headTags: [
      extractor.getStyleTags(),
      extractor.getLinkTags(),
      headTags
    ].join('\n'),
    bodyTags: [extractor.getScriptTags(), bodyTags].join('\n'),
    ...renderParams,
    app
  });
};
