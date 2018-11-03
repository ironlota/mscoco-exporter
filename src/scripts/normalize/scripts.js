const command = 'normalize-file';
const description = 'Normalize Annotation JSON file';

const options = require('./options');
const actions = require('./actions');

module.exports = {
  command,
  description,
  options,
  actions,
};
