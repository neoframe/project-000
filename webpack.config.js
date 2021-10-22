const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devServer: {
    open: true,
    hot: true,
    host: 'localhost',
    port: 29997,
    historyApiFallback: true,
  },
  mode: 'development',
  target: 'web',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    }, {
      test: /\.(jpg|jpeg|png)$/,
      use: ['file-loader'],
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        removeCommentsFromCDATA: true,
        minifyJS: true,
      },
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[fullhash].js',
    sourceMapFilename: 'bundle.[fullhash].js.map',
    publicPath: '/',
  },
};
