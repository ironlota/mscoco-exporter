const Promise = require('bluebird');

const fs = Promise.promisifyAll(require('fs'));

fs.existsAsync = Promise.promisify
  ((path, exists2callback) => {
    fs.exists(path, (exists) => {
      exists2callback(null, exists);
    });
  });

module.exports = fs;