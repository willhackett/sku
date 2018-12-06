const envCi = require('env-ci');

const { isCI, service } = envCi();

const logGroup = groupHeading => {
  if (isCI && service === 'buildkite') {
    console.log(`--- ${groupHeading}`);
  }
};

module.exports = {
  logGroup
};
