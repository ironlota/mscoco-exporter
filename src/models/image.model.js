const mongoose = require('mongoose');
const config = require('config');

const schema = require('./schema');

const captionSchema = new mongoose.Schema({
  id: { type: String },
  en: { type: String },
  caption_id: { type: Number },
});

const imageSchema = new mongoose.Schema({
  ...schema,
  captions: { type: [captionSchema], default: [] },
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
