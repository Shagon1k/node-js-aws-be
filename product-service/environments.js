const path = require('path');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.resolve(ROOT_DIR, './.webpack');

module.exports = {
  ROOT_DIR,
  DIST_DIR
};
