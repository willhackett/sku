const path = require('path');
const inquirer = require('inquirer');
const deasyncPromise = require('deasync-promise');
const copyTemplateDir = require('copy-template-dir');
const spawn = require('cross-spawn');

const whichYarn = spawn.sync('which', ['yarn'], { stdio: 'inherit' });
const hasYarn = whichYarn.status === 0;

const install = [
  'react',
  'react-dom',
  'react-test-renderer@15.5.4',
  'seek-style-guide',
  'react-helmet@^3',
  'react-autosuggest@^8',
  'react-isolated-scroll@0.1.0',
  'classnames@^2',
  'lodash.omit@^4',
  'lodash.range@^3',
  'express@^4',
  'body-parser@^1'
];

const templates = {
  'Static React app': {
    folder: 'react-static',
    install: install
  },
  'Server-rendered React app': {
    folder: 'react-server',
    install: install
  }
};

const answers = deasyncPromise(
  inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'What type of project would you like to generate?',
      choices: Object.keys(templates)
    }
  ])
);

const template = templates[answers.template];

const locals = {};
const inDir = path.join(__dirname, '../templates', template.folder);
const outDir = path.join(process.cwd());

copyTemplateDir(inDir, outDir, locals, (err, createdFiles) => {
  if (err) throw err;

  createdFiles.forEach(filePath => console.log(`Created ${filePath}`));

  const proc = spawn.sync(
    ...(hasYarn
      ? ['yarn', ['add', ...template.install], { stdio: 'inherit' }]
      : [
          'npm',
          ['install', '--save-dev', ...template.install],
          { stdio: 'inherit' }
        ])
  );

  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(proc.status);
  }

  spawn(hasYarn ? 'yarn' : 'npm', ['start', 'AU'], { stdio: 'inherit' });
});
