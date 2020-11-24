const path = require('path');

const ROOT_DIR = process.cwd();
const SRC_DIR = path.resolve(ROOT_DIR, './src');
const DIST_DIR = path.resolve(ROOT_DIR, './dist');
const CONFIG_DIR = path.resolve(ROOT_DIR, './config');

module.exports = {
  SRC_DIR,
  DIST_DIR,
  CONFIG_DIR,
};
