const path = require('path');
const inquirer = require('inquirer');
const deasyncPromise = require('deasync-promise');
const copyTemplateDir = require('copy-template-dir');
const spawn = require('cross-spawn');

const install = [
  'react',
  'react-dom',
  'seek-style-guide',
  'react-helmet@^3',
  'react-autosuggest@^8',
  'react-isolated-scroll@0.1.0',
  'classnames@^2',
  'lodash.omit@^4',
  'lodash.range@^3'
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
    },
    {
      type: 'confirm',
      name: 'confirmed',
      message: `Are you sure you want to generate a new project in ${process.cwd()}?`
    }
  ])
);

if (!answers.confirmed) {
  process.exit(1);
}

const template = templates[answers.template];

const locals = {};
const inDir = path.join(__dirname, '../templates', template.folder);
const outDir = path.join(process.cwd());

copyTemplateDir(inDir, outDir, locals, (err, createdFiles) => {
  if (err) throw err;

  createdFiles.forEach(filePath => console.log(`Created ${filePath}`));

  const proc = spawn.sync(
    'npm',
    ['install', '--save', 'sku', ...template.install],
    { stdio: 'inherit' }
  );

  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(proc.status);
  }

  spawn('npm', ['start'], { stdio: 'inherit' });
});
