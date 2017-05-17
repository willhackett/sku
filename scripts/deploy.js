const deployToS3 = require('../wip_modules/deployToS3');
const builds = require('../config/builds');
const open = require('open');
var argv = require('minimist')(process.argv.slice(2));
const openInBrowser = !!argv.open || false;

Promise.all(
  builds.map(({ name, paths, env = {} }) => {
    const {
      AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY,
      AWS_S3_PREFIX = env.AWS_S3_PREFIX,
      AWS_S3_BUCKET = env.AWS_S3_BUCKET,
      DEPLOY_TARGET = env.DEPLOY_TARGET
    } = process.env;

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
    if (typeof AWS_S3_PREFIX !== 'string') {
      throw new Error(
        'process.env.AWS_S3_PREFIX must be available as a string'
      );
    }
    if (typeof AWS_S3_BUCKET !== 'string') {
      throw new Error(
        'process.env.AWS_S3_BUCKET must be available as a string'
      );
    }
    if (typeof DEPLOY_TARGET !== 'string') {
      throw new Error(
        'process.env.DEPLOY_TARGET must be available as a string'
      );
    }

    const params = {
      localDir: undefined,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      prefix: `${AWS_S3_PREFIX}/${name}`,
      bucket: AWS_S3_BUCKET,
      cacheControlMaxAge: 5,
      dryRun: false
    };
    params.localDir = paths.public;
    return deployToS3(params).then(() => {
      params.localDir = paths.dist;
      return deployToS3(params).then(
        () => `${DEPLOY_TARGET}${AWS_S3_PREFIX}/${name}`
      );
    });
  })
).then(deployedLocations => {
  console.log(
    'Successfully deployed your application(s)\n',
    deployedLocations.join(', \n')
  );
  if (openInBrowser) {
    deployedLocations.forEach(location => {
      open(location + '/index.html');
    });
  }
});
