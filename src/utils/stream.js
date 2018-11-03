const JSONStream = require('JSONStream');
const es = require('event-stream');

const fs = require('./fs-promise');

const readStream = file => {
  const jsonRead = fs.createReadStream(file, {
    encoding: 'utf8',
  });

  return jsonRead;
};

const writeStream = file => {
  const stream = fs.createWriteStream(file, {
    encoding: 'utf8',
  });

  return stream;
};

module.exports = {
  readStream,
  writeStream,
  streamWithQuery$: (file, query = '*') => {
    const jsonRead = readStream(file);
    const parser = JSONStream.parse(query);

    return jsonRead.pipe(parser).pipe(es.mapSync(data => data));
  },
  stream$: file => {
    const jsonRead = readStream(file);
    const parserImages = JSONStream.parse('images.*');
    const parserAnnotations = JSONStream.parse('annotations.*');

    return {
      images$: jsonRead.pipe(parserImages).pipe(es.mapSync(data => data)),
      annotations$: jsonRead
        .pipe(parserAnnotations)
        .pipe(es.mapSync(data => data)),
    };
  },
};
