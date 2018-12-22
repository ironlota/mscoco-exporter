const options = yarg =>
  yarg
    .option('--fileFlickr', {
      alias: 'fileFlickr',
      describe: 'Flickr Annotation JSON file',
      required: true,
    })
    .option('--fileMscoco', {
      alias: 'fileMscoco',
      describe: 'MSCOCO Annotation JSON file',
      required: true,
    })
    .option('--fileID', {
      alias: 'fileID',
      describe: 'Annotation JSON ID file',
      default: '',
    })
    .option('--query', {
      alias: 'query',
      describe: 'JSONStream query',
      default: '*',
    })
    .option('--folder', {
      alias: 'folder',
      describe: 'Output folder',
      default: 'emotionize',
    });

module.exports = options;
