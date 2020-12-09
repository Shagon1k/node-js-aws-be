import { SRC_DIR, DIST_DIR } from '../environments';

const config = {
  entry: SRC_DIR,
  output: {
    path: DIST_DIR,
    filename: 'index.js',
  },
  target: 'node',
  mode: 'development',
  devtool: 'eval-source-map',
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
  }
};

export default config;
