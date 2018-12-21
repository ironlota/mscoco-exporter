const signale = require('signale');

const bluebird = require('bluebird');
const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = bluebird.Promise;

module.exports = {
  createConnection: () =>
    mongoose
      .connect(
        process.env.MONGODB || config.get('mongodb').url,
        { useNewUrlParser: true }
      )
      .then(
        () => {
          signale.success('Connect successfully with MongoDB');
        },
        err => {
          signale.error(err);
        }
      )
      .catch(err => {
        signale.fatal(err);
      }),
  closeConnection: () =>
    mongoose.connection
      .close()
      .then(() => {
        signale.success('Successfully close MongoDB Connection');
      })
      .catch(err => {
        signale.fatal(err);
      }),
};
