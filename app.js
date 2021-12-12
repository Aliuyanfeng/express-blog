var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// 挂在bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './dist')));
// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', indexRouter);
app.use('/admin', usersRouter);

// const  NodeMediaServer  = require('node-media-server');

// const config = {
//     rtmp: {
//         port: 1935,
//         chunk_size: 60000,
//         gop_cache: true,
//         ping: 60,
//         ping_timeout: 30
//     },
//     http: {
//         port: 8000,
//         allow_origin: '*'
//     }
// };

// var nms = new NodeMediaServer(config);
// nms.run();


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
