module.exports = {
  plugins: [
    require('postcss-import'),
    process.env.NODE_ENV === 'production' ? require('autoprefixer') : false
  ]
};
