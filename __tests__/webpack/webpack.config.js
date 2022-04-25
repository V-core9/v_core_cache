const path = require('path');

module.exports = {
  entry: path.join(__dirname, './source.js'),
  mode: 'development',
  target: 'web',
  output: {
    path: path.resolve(__dirname),
    filename: 'app.js',
  },
};
