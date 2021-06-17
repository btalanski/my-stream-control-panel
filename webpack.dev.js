// node modules
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// webpack plugins
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

module.exports = merge(common, {
  output: {
    path: '/',
    filename: 'js/[name].js',
    publicPath: settings.devServerConfig.public() + '/',
    pathinfo: true
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(css|sss)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              url: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        type: 'asset/resource',
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin(settings.htmlWebpackPluginConfig)
  ]
});