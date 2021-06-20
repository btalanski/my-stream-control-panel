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
    filename: './js/[name].bundle.js'
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      {
        test: /\.(css|sss)$/i,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
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
