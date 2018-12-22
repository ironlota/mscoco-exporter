const signale = require('signale');
const chalk = require('chalk');
const ora = require('ora');

const path = require('path');
const _ = require('lodash');

const readline = require('readline');

const { Transform: json2csvTransform } = require('json2csv');

const { createConnection, closeConnection } = require('../../utils/mongo');
const models = require('../../models');

const fs = require('../../utils/fs-promise');
const {
  streamWithQuery$,
  streamWithoutQuery$,
  readStream,
  writeStream,
} = require('../../utils/stream');

const { fieldNormalize, unwind } = require('../fields');

const actions = arg => {
  if (_.isEmpty(arg.fileFlickr)) {
    signale.fatal(new Error('You need to enter flickr file path'));
  }

  if (_.isEmpty(arg.fileMscoco)) {
    signale.fatal(new Error('You need to enter mscoco file path'));
  }

  const spinner = ora(`${chalk.bgCyan('READING')} Images Data\n`).start();

  /**
   * Read File
   */

  const imagesFlickr$ = streamWithQuery$(path.resolve(arg.fileFlickr), '*');
  const imagesMscoco$ = streamWithQuery$(path.resolve(arg.fileMscoco), '.');

  let data = [];

  const idEmot = [];

  if (!_.isEmpty(arg.fileID)) {
    const lineReaderID = readline.createInterface({
      input: fs.createReadStream(path.resolve(arg.fileID)),
    });

    lineReaderID.on('line', line => {
      idEmot.push(Number(line));
    });
  }

  imagesFlickr$
    .on('error', err => {
      signale.fatal(err);
      spinner.fail(err);
    })
    .on('data', _data => {
      data.push({
        ..._data,
        image_id: `flickr-${_data.image_id}`,
        need_emotion: true,
      });
    })
    .on('end', async () => {
      // spinner.start(`${chalk.bgCyan('READING')} Images Data\n`);
      spinner.succeed(`${chalk.bgGreen('READING')} Images Data SUCCEED!\n`);
    });
  spinner.start();

  const temp = [];

  imagesMscoco$
    .on('error', err => {
      signale.fatal(err);
      spinner.fail(err);
    })
    .on('data', _data => {
      let emotion = true;

      if (!_.isEmpty(idEmot)) {
        emotion = idEmot.some(val => val === _data.image_id);
      }

      /* eslint-disable */
      const { coco_url, flickr_url, image_id, ...rest } = _data;

      temp.push({
        ...rest,
        image_id: `coco-${image_id}`,
        url: coco_url,
        need_emotion: emotion,
      });
    })
    .on('end', async () => {
      spinner.succeed(`${chalk.bgGreen('READING')} Images Data SUCCEED!\n`);

      console.log('mscoco', temp.length);

      console.log('Before mscoco', data.length);

      data = [...temp, ...data];
      data.sort((b, a) => a.obj_id - b.obj_id);

      console.log('After mscoco', data.length);

      // console.log(data[data.length - 1]);
      // console.log(idEmot[0]);
      console.log(data.length);
      console.log(data[data.length - 1]);
      console.log(data.find(dat => dat.image_id === idEmot[0]), idEmot[0]);
      // .start();

      // spinner.text = `${chalk.bgCyan('READING')} Annotations Data\n`;
      /**
       * Writing File
       */
      const isDirCreated = await fs.existsAsync(arg.folder);
      if (!isDirCreated) await fs.mkdirAsync(arg.folder);

      const filename = path.resolve(`${arg.folder}/${new Date().getTime()}`);

      const jsonFile = writeStream(`${filename}.json`).on('open', () => {
        spinner.text = `${chalk.bgCyan('WRITING')} JSON Data!\n`;
      });

      jsonFile.write('[');
      data.forEach(value => {
        jsonFile.write(`${JSON.stringify(value, null, 2)},\n`);
      });

      jsonFile.write(']');

      await createConnection();

      await models.imageTranslated.collection
        .insertMany(data)
        .then(() => {
          signale.success(
            `${chalk.bgGreen(
              'INSERTING'
            )} Docs were successfully stored to MongoDB!`
          );
        })
        .catch(err => signale.fatal(err));

      await closeConnection();

      jsonFile
        .end(() => {
          spinner
            .succeed(`${chalk.bgGreen('WRITING')} JSON Data SUCCEED!\n`)
            .start();

          const inputJSONFile = readStream(`${filename}.json`).on(
            'open',
            () => {
              spinner.text = `${chalk.bgCyan('CREATING')} CSV Data!\n`;
            }
          );

          const csvFile = writeStream(`${filename}.csv`)
            .on('open', () => {
              spinner.text = `${chalk.bgCyan('WRITING')} CSV Data!\n`;
            })
            .on('close', () => {
              spinner
                .succeed(`${chalk.bgGreen('WRITING')} CSV Data SUCCEED!\n`)
                .stop();
            });

          const json2csv = new json2csvTransform(
            { fields: fieldNormalize, unwind },
            { highWaterMark: 16384, encoding: 'utf-8', objectMode: true }
          );

          inputJSONFile.pipe(json2csv).pipe(csvFile);
        })
        .on('end', async () => {
          spinner.succeed(
            `${chalk.bgGreen('READING')} Annotations Data SUCCEED!\n`
          );
        });
    });
  /**
   * End of Read File
   */
};

module.exports = actions;
