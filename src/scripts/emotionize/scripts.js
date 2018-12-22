const command = 'emotionize-file';
const description = 'Transform Emotion in JSON file';

const options = require('./options');
const actions = require('./actions');

module.exports = {
  command,
  description,
  options,
  actions,
};
