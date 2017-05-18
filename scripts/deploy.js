const deployToS3 = require('../wip_modules/deployToS3');
const builds = require('../config/builds');
const open = require('open');
const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
const openInBrowser = !!argv.open || false;

Promise.all(
  builds.map(({ name, paths, env, deploy }) => {
    const {
      AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY,
      filePrefix = process.env.AWS_S3_PREFIX,
      bucketName = process.env.AWS_S3_BUCKET,
      productionUrl = process.env.DEPLOY_TARGET
    } = deploy;

    if (typeof AWS_ACCESS_KEY_ID !== 'string') {
      throw new Error(
        'process.env.AWS_ACCESS_KEY_ID must be available as a string'
      );
    }
    if (typeof AWS_SECRET_ACCESS_KEY !== 'string') {
      throw new Error(
        'process.env.AWS_SECRET_ACCESS_KEY must be available as a string'
      );
    }
    if (typeof bucketName !== 'string') {
      throw new Error(
        'buildConfig.deploy.bucketName must be available as a string'
      );
    }

    const location = [];
    if (filePrefix) {
      location.push(filePrefix);
    }
    if (name) {
      location.push(name);
    }

    const params = {
      localDir: undefined,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      prefix: location.join('/'),
      bucket: bucketName,
      cacheControlMaxAge: 5,
      dryRun: false
    };

    params.localDir = paths.dist;
    return deployToS3(params)
      .then(() => {
        if (fs.existsSync(paths.public)) {
          params.localDir = paths.public;
          return deployToS3(params).then(() => {});
        }
      })
      .then(
        () =>
          `${productionUrl}${filePrefix ? '/' + filePrefix : ''}${name ? '/' + name : ''}/index.html`
      );
  })
).then(deployedLocations => {
  console.log(
    'Successfully deployed your application(s)\n',
    deployedLocations.join(', \n')
  );
  if (openInBrowser) {
    deployedLocations.forEach(location => {
      open(location);
    });
  }
});
