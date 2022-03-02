const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const ComponentDirectoryPlugin = require('component-directory-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');

const paths = require('../paths');
const {
  PRODUCTION,
  PAGE_LANG,
  PAGE_TITLE,
  PROTOCOL,
  HOST,
  PORT,
  DO_SPACE_NS,
  DO_SPACE_NAME,
} = require('../const');

module.exports = {
  entry: [`${paths.client}/index.tsx`],
  output: {
    path: paths.build,
    publicPath: '/',
    filename: 'js/[name].js?v=[hash:5]',
  },
  resolve: {
    modules: ['node_modules', paths.client],
    alias: {
      config: paths.config,
      theme: `${paths.client}/theme.styl`,
      uilib: '@foreverido/uilib',
      quill: `${paths.modules}/quill`,
      'quill-css': `${paths.modules}/quill/dist/quill.core.css`,
      // react: 'preact/compat',
      // 'react-dom': 'preact/compat',
      // 'react-dom/test-utils': 'preact/test-utils',
    },
    // plugins: [new ComponentDirectoryPlugin()],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  optimization: {
    moduleIds: 'named',
  },
  module: {
    noParse: /node_modules\/quill\/dist/,
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader',
        include: paths.src,
        exclude: [paths.modules],
        // exclude: {
        //   exclude: [paths.modules],
        //   test: [/\.quill\.js$/],
        // },
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          { loader: 'css-modules-typescript-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  ['postcss-preset-env', { stage: 3, autoprefixer: true }],
                ],
              },
            },
          },
          'stylus-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        exclude: paths.modules,
        oneOf: [
          {
            issuer: /\.(t|j)sx?$/,
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: 'react-svg-loader',
              },
            ],
          },
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]',
            outputPath: 'images/',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(PRODUCTION),
      PROTOCOL: JSON.stringify(PROTOCOL),
      HOST: JSON.stringify(HOST),
      PORT: JSON.stringify(PORT),
      DO_SPACE_NS: JSON.stringify(DO_SPACE_NS),
      DO_SPACE_NAME: JSON.stringify(DO_SPACE_NAME),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${paths.assets}/*.css`,
          to: paths.build,
        },
        {
          from: `${paths.assets}/fonts`,
          to: `${paths.build}/fonts`,
        },
        {
          from: `${paths.assets}/logo.svg`,
          to: paths.build,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      lang: PAGE_LANG,
      title: PAGE_TITLE,
      filename: 'index.html',
      template: `${paths.assets}/index.html`,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new FaviconWebpackPlugin({
      logo: `${paths.assets}/logo.svg`,
      mode: 'webapp', // optional can be 'webapp' or 'light' - 'webapp' by default
      devMode: 'webapp', // optional can be 'webapp' or 'light' - 'light' by default
      favicons: {
        appName: 'sandbox',
        appDescription: 'sandbox',
        developerName: 'Me',
        developerURL: null, // prevent retrieving from the nearest package.json
        background: '#fff',
        theme_color: '#111',
        icons: {
          coast: false,
          yandex: false,
        },
      },
    }),
    new MiniCssExtractPlugin({
      filename: PRODUCTION ? '[name].[fullhash].css' : '[name].css',
      chunkFilename: PRODUCTION ? '[id].[fullhash].css' : '[id].css',
    }),
  ],
};
