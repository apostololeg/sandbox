const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./common.js');
const paths = require('../paths');

const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const proxyConfig = {
  secure: false,
  changeOrigin: true,
  logLevel: 'debug',
  target: {
    host: "localhost",
    protocol: 'http:',
    port: 3000
  },
};

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
];

if (process.env.ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  plugins,
  devtool: 'eval-source-map',
  devServer: {
    // hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Headers': 'Content-Type, Cookie',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    },
    contentBase: paths.build,
    compress: true,
    historyApiFallback: true,
    port: 9000,
    proxy: {
      '/graphql': proxyConfig,
      '/upload': proxyConfig
    }
  }
});
