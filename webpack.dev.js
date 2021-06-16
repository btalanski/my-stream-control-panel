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

// Configure the webpack-dev-server
const configureDevServer = () => {
  return {
    public: settings.devServerConfig.public(),
    host: settings.devServerConfig.host(),
    port: settings.devServerConfig.port(),
    static: path.resolve(__dirname, settings.paths.dist.base),
    https: !!parseInt(settings.devServerConfig.https()),
    hot: true,
    open: true,
    liveReload: true,
    watchFiles: path.resolve(__dirname, 'src'),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
};

// Configure Image loader for images imported via js import
const configureImageLoader = () => {
  return {
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
  };
};

// Configure postcss loader for (p)css files imported via js import
const configurePostcssLoader = () => {
  return {
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
  };
};

module.exports = merge(common, {
  output: {
    path: '/',
    filename: 'js/[name].js',
    publicPath: settings.devServerConfig.public() + '/',
    pathinfo: true
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: configureDevServer(),
  module: {
    rules: [configurePostcssLoader(), configureImageLoader()]
  },
  plugins: [
    new DashboardPlugin(),
    new HtmlWebpackPlugin(settings.htmlWebpackPluginConfig)
  ]
});
