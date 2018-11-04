const signale = require('signale');
const chalk = require('chalk');

const path = require('path');
const _ = require('lodash');

const { createConnection, closeClonnection } = require('../../utils/mongo');
const { streamWithQuery$ } = require('../../utils/stream');
const fs = require('../../utils/fs-promise');

const models = require('../../models');

const action = async arg => {
  await createConnection();
  if (_.isEmpty(arg.file)) {
    try {
      const files = await fs.readdirAsync(path.resolve(`${arg.folder}`));
      const normalizedFile = _.last(
        files.filter(value => value.includes('.json'))
      );

      const data = [];

      signale.watch(`${chalk.bgCyan('READING')} JSON Data`);
      const stream$ = streamWithQuery$(
        path.resolve(`./${arg.folder}/${normalizedFile}`)
      );

      stream$
        .on('error', err => {
          signale.fatal(err);
        })
        .on('data', dat => {
          const { id, ...rest } = dat;
          data.push({
            ...rest,
            image_id: id,
          });
        })
        .on('end', async () => {
          signale.success(`${chalk.bgGreen('READING')} JSON Data SUCCEED!`);

          signale.watch(`${chalk.bgGreen('INSERTING')} JSON Data to MongoDB`);
          await models.image.collection
            .insertMany(data)
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
