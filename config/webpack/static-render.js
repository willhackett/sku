const render = require(RENDER_ENTRY).default;

export default async function staticRender({ isDev, renderConfig }) {
  console.log({ renderConfig, isDev, render });
  const pathData = !isDev ? renderConfig.pathData : renderConfig.devPathData;
  const getPath = !isDev
    ? renderConfig.transformPath
    : renderConfig.devTransformPath;

  const jsEntries = { main: 'main.js' };
  const cssEntries = { main: 'styles.css' };

  const configsToRender = [];

  pathData.environment.forEach(environment => {
    pathData.site.forEach(site => {
      pathData.path.forEach(path => {
        configsToRender.push({
          environment,
          site,
          path
        });
      });
    });
  });

  const pages = {};

  await Promise.all(
    configsToRender.map(async pageConfig => {
      pages[getPath(pageConfig)] = await render({
        ...pageConfig
      });
    })
  );
  return pages;
}
