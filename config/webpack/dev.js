const webpack = require('webpack');
const merge = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./common.js');
const paths = require('../paths');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new ReactRefreshWebpackPlugin({
    overlay: false,
  }),
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
    static: paths.build,
    compress: true,
    historyApiFallback: true,
    port: 9006,
    proxy: {
      '/api': {
        secure: false,
        changeOrigin: true,
        target: `http://localhost:${process.env.API_PORT || 3010}/`,
      },
    },
  },
});
