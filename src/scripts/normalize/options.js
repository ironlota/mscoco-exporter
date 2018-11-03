const options = yarg =>
  yarg
    .option('--file', {
      alias: 'file',
      describe: 'Annotation JSON file',
      required: true,
    })
    .option('--query', {
      alias: 'query',
      describe: 'JSONStream query',
      default: '*',
    })
    .option('--folder', {
      alias: 'folder',
      describe: 'Output folder',
      default: 'data',
    });

module.exports = options;
