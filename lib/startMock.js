const chalk = require('chalk');
const forever = require('forever-monitor');
const fs = require('fs');

module.exports = () =>
  new Promise(resolve => {
    fs.access('mock/server.js', err => {
      if (!err) {
        var mock = new forever.Monitor('mock/server.js', {
          watch: true,
          watchDirectory: 'mock',
          killTree: true
        });

        mock.on('start', function() {
          console.log(chalk.magenta('Starting mock server'));
          resolve();
        });

        mock.on('watch:restart', function(info) {
          console.log(
            chalk.magenta(
              'Restaring mock server script because ' + info.stat + ' changed'
            )
          );
        });

        mock.start();
      } else {
        resolve();
      }
    });
  });
