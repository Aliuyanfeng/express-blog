var createError = require('http-errors');
var express = require('express');
var mysql = require('mysql')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')

var expressJwt = require('express-jwt')

const { PRIVITE_KEY, EXPIRESD } = require('./config/secret.js')

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

// 中间件使用，接口安全校验token,刨除指定的接口
app.use(expressJwt({
  secret: PRIVITE_KEY,
  algorithms: ['HS256']
}).unless({
  path: [
    '/',
    '/index',
    'admin/getInfo',
    '/admin/user/login', //后台登陆接口不做校验
    { url: /^\/index\/.*/, methods: ['GET','POST'] }] //以/index开头的接口不做校验，其为博客展示相关接口
}))

app.use('/index', indexRouter); //博客接口
app.use('/admin', usersRouter); //博客后台接口

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
  // 这里可以捕捉token失效的状态
  console.log(err)
  if (err.name === 'UnauthorizedError') {   
    res.send({
      code: 401,
      info:'登录过期'
    })
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
  
});

module.exports = app;
