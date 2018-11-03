const glob = require('glob');
const path = require('path');

const defaultKeyExtractor = ({ file }) => file;
const defaultModuleExtractor = moduleObj => moduleObj;

module.exports = (globPattern, _opts) => {
  const opts = {
    keyExtractor: defaultKeyExtractor,
    moduleExtractor: defaultModuleExtractor,
    ..._opts,
  };
  return glob.sync(globPattern).reduce((files, file) => {
    /* eslint-disable */
    const mod = require(path.resolve(file));
    const modObj = opts.moduleExtractor(mod);
    const key = opts.keyExtractor({
      file,
      mod,
    });
    files[key] = modObj;
    /* eslint-enable */
    return files;
  }, {});
};
