const mongoose = require('mongoose');
const config = require('config');

const schema = require('./schema');

const imageSchema = new mongoose.Schema({
  ...schema,
  captions: { type: [String], default: [] },
});

const imageModel = mongoose.model(
  config.get('mongodb').imagesCollection,
  imageSchema
);

module.exports = {
  name: 'image',
  schema: imageSchema,
  model: imageModel,
};
