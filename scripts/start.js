const startApp = require('../lib/startApp');
const startMock = require('../lib/startMock');

startMock().then(startApp);
