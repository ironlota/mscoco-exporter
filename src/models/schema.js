module.exports = {
  image_id: { type: Number },
  file_name: { type: String },
  coco_url: { type: String },
  flickr_url: { type: String },
  height: { type: Number },
  width: { type: Number },
  date_captured: { type: Date, default: Date.now },
};
