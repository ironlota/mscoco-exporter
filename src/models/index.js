const glob = require('../utils/glob-export');

module.exports = glob('./**/*.model.js', {
  keyExtractor: ({ mod }) => mod.name,
  moduleExtractor: mod => mod.model,
});
