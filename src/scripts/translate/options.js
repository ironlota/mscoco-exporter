const options = yarg =>
  yarg
    .option('--file', {
      alias: 'file',
      describe: 'Normalized JSON file',
      default: '',
    })
    .option('--folder', {
      alias: 'folder',
      describe: 'Output folder',
      default: 'data',
    })
    .option('--target', {
      alias: 'target',
      describe: 'Target Language',
      default: 'id',
    });

module.exports = options;
