module.exports.run = function () {
  require('babel-register')({
    ignore: [/build/, /node_modules/],
    extensions: ['.js'],
  });
  require('babel-polyfill');
};

