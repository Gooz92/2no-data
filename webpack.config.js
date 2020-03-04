const path = require('path');

module.exports = {
  entry: './view/app.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'view'),
    filename: '../dist/bundle.js'
  }
};