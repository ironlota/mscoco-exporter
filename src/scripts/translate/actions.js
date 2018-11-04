const signale = require('signale');
const chalk = require('chalk');

const path = require('path');
const Promise = require('bluebird');
const _ = require('lodash');

const { Transform: json2csvTransform } = require('json2csv');

const { createConnection, closeClonnection } = require('../../utils/mongo');
const {
  streamWithQuery$,
  readStream,
  writeStream,
} = require('../../utils/stream');
const translate = require('../../utils/google-translate');
const fs = require('../../utils/fs-promise');

const models = require('../../models');

const { fieldTranslated, unwind } = require('../fields');

const action = async arg => {
  if (_.isEmpty(arg.file)) {
    try {
      const files = await fs.readdirAsync(path.resolve(`${arg.folder}`));
      const normalizedFile = _.last(
        files.filter(value => value.includes('.json'))
      );

      const data = [];
      const promises = [];

      signale.watch(`${chalk.bgCyan('READING')} JSON Data`);
      const stream$ = streamWithQuery$(
        path.resolve(`./${arg.folder}/${normalizedFile}`)
      );

      stream$
        .on('error', err => {
          signale.fatal(err);
        })
        .on('data', dat => {
          promises.push(
            dat.captions.map(current =>
              translate
                .translate(current, arg.target)
                .then(results => _.head(results))
                .catch(err => {
                  signale.error(err);
                })
            )
          );

          data.push(dat);
        })
        .on('end', async () => {
          signale.success(`${chalk.bgGreen('READING')} JSON Data SUCCEED!\n`);

          await createConnection();

          signale.watch(`${chalk.bgRed('TRANSLATING')} JSON Data`);

          const dataTranslated = [];

          const translateData = async (promise, index) => {
            const translations = await Promise.all(promise);
            const captionsTemp = data[index].captions;

            const captions = translations.map((value, idx) => ({
              en: captionsTemp[idx],
              id: value,
            }));

            const { id, ...rest } = data[index];

            dataTranslated.push({
              ...rest,
              image_id: id,
              captions,
            });
          };

          await promises.reduce(
            (promise, translatePromise, index) =>
              promise.then(() => {
                signale.info(
                  `${chalk.bgRed('TRANSLATING')} image no: ${index}`
                );

                return Promise.all([
                  Promise.delay(1000),
                  translateData(translatePromise, index),
                ]);
              }),
            Promise.resolve()
          );

          signale.success(
            `${chalk.bgGreen('TRANSLATING')} JSON Data SUCCEED\n`
          );

          /**
           * Writing File
           */
          const isDirCreated = await fs.existsAsync(arg.folder);
          if (!isDirCreated) await fs.mkdirAsync(arg.folder);

          const filename = path.resolve(
            `${arg.folder}/${new Date().getTime()}-translated`
          );

          const jsonFile = writeStream(`${filename}.json`).on('open', () => {
            signale.watch(`${chalk.bgGreen('WRITING')} JSON Data!`);
          });

          jsonFile.write('[');

          dataTranslated.forEach(value => {
            jsonFile.write(`${JSON.stringify(value, null, 2)},\n`);
          });

          jsonFile.write(']');

          jsonFile.end(() => {
            signale.success(`${chalk.bgGreen('WRITING')} JSON Data SUCCEED!`);

            const inputJSONFile = readStream(`${filename}.json`);

            const csvFile = writeStream(`${filename}-id.csv`)
              .on('open', () => {
                signale.watch(`${chalk.bgGreen('WRITING')} CSV Data`);
              })
              .on('close', () => {
                signale.watch(`${chalk.bgGreen('WRITING')} CSV Data SUCCEED!`);
              });

            const json2csv = new json2csvTransform(
              { fields: fieldTranslated, unwind },
              { highWaterMark: 16384, encoding: 'utf-8', objectMode: true }
            );

            inputJSONFile.pipe(json2csv).pipe(csvFile);
          });
          /**
           * End of Writing File
           */

          signale.watch(`${chalk.bgGreen('INSERTING')} JSON Data to MongoDB`);
          await models.imageTranslated.collection
            .insertMany(dataTranslated)
            .then(() => {
              signale.success(
                `${chalk.bgGreen(
                  'INSERTING'
                )} Docs were successfully stored to MongoDB!`
              );
            })
            .catch(err => signale.fatal(err));

          await closeClonnection();
        });
    } catch (error) {
      signale.error(error);
    }
  }
};

module.exports = action;
