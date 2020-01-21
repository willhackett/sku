const playroom = require('playroom/lib');

const makePlayroomConfig = require('../config/playroom/makePlayroomConfig');
const { cwd } = require('../lib/cwd');
const { start } = playroom({ cwd: cwd(), ...makePlayroomConfig() });

start();
