const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./common.js');
const paths = require('../paths');

const proxyConfig = {
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
  target: 'http://localhost:3000/',
};

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  plugins,
  devtool: 'source-map',
  devServer: {
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    },
    static: paths.build,
    compress: true,
    historyApiFallback: true,
    port: 9006,
    proxy: {
      '/api': proxyConfig,
    },
  },
});
