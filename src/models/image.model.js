const mongoose = require('mongoose');
const config = require('config');

const imageSchema = new mongoose.Schema({
  image_id: { type: Number },
  license: { type: Number },
  file_name: { type: String },
  coco_url: { type: String },
  height: { type: Number },
  width: { type: Number },
  date_captured: { type: Date, default: Date.now },
  flickr_url: { type: String },
  known_for: { type: [String], default: [] },
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
