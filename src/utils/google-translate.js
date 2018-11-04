const { Translate } = require('@google-cloud/translate');

const config = require('config');

module.exports = new Translate({
  projectId: config.get('google').projectId,
  keyFilename: config.get('google').keyFilename,
});
