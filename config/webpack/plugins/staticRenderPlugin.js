const path = require('path');
const { flatMap, partition } = require('lodash');
const MultiStaticRenderPlugin = require('multi-static-render-webpack-plugin');

const build = require('../../build');
const { environments, routes, sites, transformPath } = build.renderConfig;
const { publicPath } = build.paths;

const debugStats = clientStats => {
  require('fs').writeFileSync(
    require('path').join(process.cwd(), 'client-stats.json'),
    JSON.stringify(clientStats)
  );
};

const mapStatsToParams = ({ clientStats, routeName }) => {
  debugStats(clientStats);
  const [styles, scripts] = partition(
    clientStats.entrypoints[routeName].assets,
    asset => asset.endsWith('.css')
  );

  const bodyTags = scripts
    .map(
      chunkFile =>
        `<script type="text/javascript" src="${path.join(
          publicPath,
          chunkFile
        )}"></script>`
    )
    .join('\n');

  const headTags = styles
    .map(
      chunkFile =>
        `<link rel="stylesheet" type="text/css" href="${path.join(
          publicPath,
          chunkFile
        )}" />`
    )
    .join('\n');

  return {
    headTags,
    bodyTags
  };
};

module.exports = () => {
  const routesToRender = flatMap(environments, environment =>
    flatMap(sites, site =>
      flatMap(routes, ({ name, route }) => ({
        environment,
        site,
        routeName: name,
        route: transformPath({ environment, site, route })
      }))
    )
  );

  return new MultiStaticRenderPlugin({
    renderDirectory: build.paths.dist,
    routes: routesToRender,
    mapStatsToParams,
    verbose: true
  });
};
