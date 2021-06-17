// node modules
const { merge } = require('webpack-merge');
const path = require('path');

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Generate entries list from settings
const configureEntries = () => {
  let entries = {};
  for (const [key, value] of Object.entries(settings.entries)) {
    entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
  }
  return entries;
};

// Configure Manifest
const configureManifest = (fileName) => {
  return {
    fileName: fileName,
    basePath: settings.manifestConfig.basePath,
    map: (file) => {
      file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
      return file;
    }
  };
};

const baseConfig = merge([
  {
    name: pkg.name,
    entry: configureEntries(),
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
      publicPath: settings.urls.publicPath(),
      filename: './js/[name].[contenthash:5].bundle.js',
      assetModuleFilename: 'img/[name][ext]',
      clean: true
    },
    resolve: {
      alias: {}
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: settings.babelLoaderConfig.exclude,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.pug$/,
          loader: 'pug-loader'
        }
      ]
    },
    plugins: [
      new WebpackNotifierPlugin({
        title: 'Webpack',
        excludeWarnings: true,
        alwaysNotify: true
      }),
      // new WebpackManifestPlugin(configureManifest('manifest.json')),
      ...(settings.copyWebpackConfig.patterns.length > 0
        ? [new CopyWebpackPlugin(settings.copyWebpackConfig)]
        : [])
    ]
  }
]);

module.exports = merge(baseConfig);
