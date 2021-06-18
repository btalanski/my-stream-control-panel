var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var streamRouter = require('./routes/stream');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev.js');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.io = io;
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stream', streamRouter);
app.use('/devices', devicesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// webpack
if (process.env.WEBPACK_DEV) {
  //reload=true:Enable auto reloading when changing JS files or content
  //timeout=1000:Time from disconnecting from server to reconnecting
  // config.entry.app.unshift(
  //   'webpack-hot-middleware/client?reload=true&timeout=1000'
  // );

  // //Add HMR plugin
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  //Enable "webpack-dev-middleware"
  app.use(
    webpackDevMiddleware(compiler, {
      writeToDisk: true
    })
  );

  //Enable "webpack-hot-middleware"
  // app.use(webpackHotMiddleware(compiler));
  console.log('Using webpack dev server');
}

module.exports = { app: app, server: server };
