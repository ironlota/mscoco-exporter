const command = 'migrations';
const description = 'Migrate to MongoDB';

const options = require('./options');
const actions = require('./actions');

module.exports = {
  command,
  description,
  options: options,
  actions: actions,
};
