const { flatMap, partition } = require('lodash');
const MultiStaticRenderPlugin = require('multi-static-render-webpack-plugin');

const build = require('../../builds');
const { environments, routes, sites, transformPath } = build.renderConfig;

const mapStatsToParams = ({ clientStats, routeName }) => {
  require('fs').writeFileSync(
    require('path').join(process.cwd(), 'client-stats.json'),
    JSON.stringify(clientStats)
  );

  const [styles, scripts] = partition(
    clientStats.entrypoints[routeName].assets,
    asset => asset.endsWith('.css')
  );

  const requiredScripts = scripts
    .map(
      chunkFile => `<script type="text/javascript" src="${chunkFile}"></script>`
    )
    .join('\n');

  const requiredStyles = styles
    .map(
      chunkFile =>
        `<link rel="stylesheet" type="text/css" href="${chunkFile}" />`
    )
    .join('\n');

  return {
    requiredScripts,
    requiredStyles
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
