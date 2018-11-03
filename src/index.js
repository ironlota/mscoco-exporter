require('dotenv').config();

const yargs = require('yargs');

const scripts = require('./scripts');

Object.values(scripts).forEach(values => {
  yargs.command(
    values.command,
    values.description,
    values.options,
    values.actions
  );
});

const { argv } = yargs
  .demandCommand(1, 'You need at least one command before moving on')
  .help();
