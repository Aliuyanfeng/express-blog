const { Router } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../config/db')


const allowHeaders = "Origin, Expires, Content-Type, X-E4M-With, Authorization";
/* GET users listing. */
router.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", allowHeaders);
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  // if (req.method.toLowerCase() == "options") res.sendStatus(200);
  //让options尝试请求快速结束
  // else next();
  if (req.method.toLowerCase() == 'options')
    res.send(200);  //让options尝试请求快速结束
  else
    next();
});
router.get('/',function (req,res,next) {
    // res.status(404).send('404 Not Found')
    res.render("error.html")
    // next(createError(404));
  });
//错误处理
// router.get('*',function (req,res,next) {
//   // res.status(404).send('404 Not Found')
//   res.render("error.html")
//   // next(createError(404));
// });

module.exports = router;
