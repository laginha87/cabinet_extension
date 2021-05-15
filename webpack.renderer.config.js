const rules = require('./webpack.rules');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dotenv = require('dotenv-webpack');


rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, {loader: 'postcss-loader'}],
});

module.exports = {
  module: {
    rules,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new Dotenv()
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
