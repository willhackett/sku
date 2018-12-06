const envCi = require('env-ci');

const { service } = envCi();

const logGroup = groupHeading => {
  if (service === 'buildkite') {
    console.log(`--- ${groupHeading}`);
  }
};

module.exports = {
  logGroup
};
