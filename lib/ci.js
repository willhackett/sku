const envCi = require('env-ci');

const { isCI, service } = envCi();

const logGroup = groupHeading => {
  console.log({
    'process.env.CI': process.env.CI,
    isCI,
    service
  });

  if (isCI && service === 'buildkite') {
    console.log(`--- ${groupHeading}`);
  }
};

module.exports = {
  logGroup
};
