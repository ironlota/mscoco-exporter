const mongoose = require('mongoose');
const config = require('config');

const schema = require('./schema');

const imageTranslatedSchema = new mongoose.Schema({
  ...schema,
  captions: { type: Array, default: [] },
});

const imageTranslatedModel = mongoose.model(
  config.get('mongodb').imagesTranslatedCollection,
  imageTranslatedSchema
);

module.exports = {
  name: 'imageTranslated',
  schema: imageTranslatedSchema,
  model: imageTranslatedModel,
};
