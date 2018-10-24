import fromPairs from 'lodash/fromPairs';
const render = require(RENDER_ENTRY).default;

export default async function staticRender({ isDev, renderConfig }) {
  const pathData = !isDev ? renderConfig.pathData : renderConfig.devPathData;
  const getPath = !isDev
    ? renderConfig.transformPath
    : renderConfig.devTransformPath;

  const jsEntries = { main: 'main.js' };
  const cssEntries = { main: 'styles.css' };

  const configsToRender = [];

  pathData.environments.forEach(environment => {
    pathData.sites.forEach(site => {
      pathData.paths.forEach(path => {
        configsToRender.push({
          environment,
          site,
          path
        });
      });
    });
  });

  const result = await Promise.all(
    configsToRender.map(async pageConfig => {
      const renderedContent = await render(pageConfig);
      return [getPath(pageConfig), renderedContent];
    })
  );

  return fromPairs(result);
}
