const slsw = require('serverless-webpack');
const path = require('path');

const environmentConstants = require('./environments');

const { DIST_DIR, SRC_DIR, CONFIG_DIR } = environmentConstants;

module.exports = {
  entry: slsw.lib.entries,  // all serverless yaml file functions
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: DIST_DIR,
  },
  mode: 'development',
  // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        enforce: 'pre', // preload the jshint loader
        exclude: /node_modules/, // exclude any and all files in the node_modules folder
        include: SRC_DIR,
        use: [
          {
            loader: 'babel-loader'
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@src': path.resolve(SRC_DIR),
      '@handlers': path.resolve(SRC_DIR, 'handlers'),
      '@data': path.resolve(SRC_DIR, 'data'),
      '@config': path.resolve(CONFIG_DIR),
    },
  },
};
