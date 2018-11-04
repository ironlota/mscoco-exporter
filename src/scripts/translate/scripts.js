const command = 'translate';
const description = 'Translate Captions from English to another language';

const options = require('./options');
const actions = require('./actions');

module.exports = {
  command,
  description,
  options: options,
  actions: actions,
};
