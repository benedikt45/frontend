const path = require('path');

let conf = {
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
      publicPath: 'dist/'
  },
  devServer: {
    overlay: true
  },
  // modules: {
  //   relues: {
  //     [
  //       test: \/.js$,
  //       loader: 'babel-loader',
  //       // exclude: '/node_modules/'
  //     ]
  //   }
  // }
};

module.exports = conf;
