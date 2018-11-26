/* eslint-disable import/no-unresolved */
import { ChunkExtractor } from '@loadable/server';

// __sku_alias__renderEntry is a webpack alias
// pointing to the consuming apps render entry
import render from '__sku_alias__renderEntry';

export default async ({ clientStats, headTags, bodyTags, ...renderParams }) => {
  const extractor = new ChunkExtractor({ stats: clientStats, entrypoints: [] });

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
