const signale = require('signale');
const chalk = require('chalk');
const ora = require('ora');

const path = require('path');
const _ = require('lodash');

const { Transform: json2csvTransform } = require('json2csv');

const fs = require('../../utils/fs-promise');
const { stream$, readStream, writeStream } = require('../../utils/stream');

const { fieldNormalize, unwind } = require('../fields');

const actions = arg => {
  if (_.isEmpty(arg.file)) {
    signale.fatal(new Error('You need to enter file path'));
  }

  const spinner = ora(`${chalk.bgCyan('READING')} Images Data\n`).start();

  /**
   * Read File
   */
  const imagesObj = {};
  const annotationsObj = {};
  const { images$, annotations$ } = stream$(path.resolve(arg.file));

  images$
    .on('error', err => {
      signale.fatal(err);
      spinner.fail(err);
    })
    .on('data', data => {
      imagesObj[data.id] = data;
    })
    .on('end', () => {
      spinner
        .succeed(`${chalk.bgGreen('READING')} Images Data SUCCEED!\n`)
        .start();

      spinner.text = `${chalk.bgCyan('READING')} Annotations Data\n`;
    });

  annotations$
    .on('error', err => {
      signale.fatal(err);
      spinner.fail(err);
    })
    .on('data', data => {
      annotationsObj[data.image_id] = [
        ...(annotationsObj[data.image_id] || []),
        data.caption,
      ];
    })
    .on('end', async () => {
      spinner.succeed(
        `${chalk.bgGreen('READING')} Annotations Data SUCCEED!\n`
      );

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

      Object.entries(annotationsObj).forEach(([key, captions]) => {
        jsonFile.write(
          `${JSON.stringify({ captions, ...imagesObj[key] }, null, 2)},\n`
        );
      });

      jsonFile.write(']');

      jsonFile.end(() => {
        spinner
          .succeed(`${chalk.bgGreen('WRITING')} JSON Data SUCCEED!\n`)
          .start();

        const inputJSONFile = readStream(`${filename}.json`).on('open', () => {
          spinner.text = `${chalk.bgCyan('CREATING')} CSV Data!\n`;
        });

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
      });
      /**
       * End of Writing File
       */
    });
  /**
   * End of Read File
   */
};

module.exports = actions;
