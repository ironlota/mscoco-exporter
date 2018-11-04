const fields = [
  'id',
  'file_name',
  'coco_url',
  'flickr_url',
  'height',
  'width',
  'date_captured',
];

const fieldNormalize = [...fields, 'captions'];
const fieldTranslated = [...fields, 'captions.id'];
const unwind = ['captions'];

module.exports = {
  fieldNormalize,
  fieldTranslated,
  unwind,
};
