// node modules
const { merge } = require('webpack-merge');
const glob = require('glob-all');
const path = require('path');
const webpack = require('webpack');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WhitelisterPlugin = require('purgecss-whitelister');

// config files
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Image loader
const imageLoaderConfig = () => {
  return {
    test: /\.(gif|png|jpe?g|svg)$/i,
    type: 'asset/resource',
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false
          },
          pngquant: {
            quality: [0.65, 0.9],
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          // the webp option will enable WEBP
          webp: {
            quality: 75
          }
        }
      }
    ]
  };
};

// Configure optimization
const optimizationConfig = () => {
  return {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(terserPluginConfig()),
      new CssMinimizerPlugin(cssMinimizerConfig())
    ]
  };
};

const cssMinimizerConfig = () => {
  return {
    minimizerOptions: {
      preset: ['default']
    }
  };
};
const terserPluginConfig = () => {
  return {
    parallel: true,
    extractComments: true,
    ...settings.terserPluginOptions
  };
};

// Configure Postcss loader
const postcssLoaderConfig = () => {
  return {
    test: /\.(pcss|css)$/,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          sourceMap: true,
          url: true
        }
      },
      {
        loader: 'postcss-loader'
      }
    ]
  };
};

// Configure PurgeCSS
const purgeCssConfig = () => {
  const paths = (settings.purgeCssConfig.paths || []).map((entry) =>
    path.join(__dirname, entry)
  );
  return {
    keyframes: false,
    paths: glob.sync(paths, { nodir: true }),
    safelist: WhitelisterPlugin(settings.purgeCssConfig.whitelist),
    extractors: [
      {
        extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
        extensions: settings.purgeCssConfig.extensions
      }
    ]
  };
};

module.exports = merge(common, {
  output: {
    filename: 'js/[name].[chunkhash:5].bundle.js',
    assetModuleFilename: 'img/[name][ext]',
    clean: true
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: optimizationConfig(),
  module: {
    rules: [postcssLoaderConfig(), imageLoaderConfig()]
  },
  plugins: [
    new HtmlWebpackPlugin(settings.htmlWebpackPluginConfig),
    new FaviconsWebpackPlugin(settings.faviconConfig),
    new ImageminWebpWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join('./css', '[name].[chunkhash:5].css'),
      chunkFilename: '[id].css'
    }),
    new PurgecssPlugin(purgeCssConfig())
  ]
});
