const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');
require('dotenv').config();

module.exports = {
  name: 'My stream control panel',
  copyright: 'Bruno Talanski',
  paths: {
    src: {
      base: './src/',
      css: './src/css/',
      js: './src/js/',
      imgs: './src/img'
    },
    dist: {
      base: './public/',
      clean: ['**/*']
    },
    templates: './src/'
  },
  urls: {
    live: '',
    publicPath: () => process.env.PUBLIC_PATH || '/'
  },
  vars: {},
  entries: {
    main: 'index.js'
  },
  babelLoaderConfig: {
    exclude: [/(node_modules|bower_components)/]
  },
  copyWebpackConfig: {
    patterns: []
  },
  htmlWebpackPluginConfig: {
    title: 'My stream control panel',
    template: './src/index.html'
  },
  criticalCssConfig: {},
  devServerConfig: {
    public: () => process.env.DEVSERVER_PUBLIC || 'http://0.0.0.0:8080',
    host: () => process.env.DEVSERVER_HOST || '0.0.0.0',
    poll: () => process.env.DEVSERVER_POLL || false,
    port: () => process.env.DEVSERVER_PORT || 8080,
    https: () => process.env.DEVSERVER_HTTPS || false
  },
  manifestConfig: {
    basePath: ''
  },
  purgeCssConfig: {
    keyframes: false,
    paths: ['./src/**/*'],
    whitelist: ['./src/**/*'],
    extensions: ['html', 'js']
  },
  terserPluginOptions: {
    terserOptions: {
      format: {
        comments: false
      },
      compress: {
        drop_console: true
      }
    },
    extractComments: false
  },
  faviconConfig: {
    logo: './src/img/favicon-src.png',
    prefix: 'favicons/',
    cache: false,
    inject: 'force',
    favicons: {
      appName: pkg.name,
      appDescription: pkg.description,
      developerName: pkg.author.name,
      developerURL: pkg.author.url,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        windows: false,
        yandex: false
      }
    }
  },
  bundleAnalyzerConfig: false // false | bundle Analyzer options
};
