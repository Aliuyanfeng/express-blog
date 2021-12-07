const { Router } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../config/db')

router.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.sendStatus(200);
  //让options尝试请求快速结束
  else next();
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.send({
    code:200,
    obj:'哈哈',

  })  
});

router.get('/getArticleList', async (req, res, next) => {
  console.log(req.query)
  var npagesize = (req.query.page - 1) * 10

  const getArticleListSql = `select * from blog_article_list limit ${npagesize},${req.query.limit}`
  
  const getPubishArticleListSql = `select * from blog_article_list where article_status = 'published' limit ${npagesize},${req.query.limit}`
 
  const getArticleTotalSql = `select count(*) as total from blog_article_list`

  var articleTotal;
  if (req.query.type == 1) {
      var dealgetArticleListSql = getArticleListSql
  } else {
      var dealgetArticleListSql = getPubishArticleListSql
  }
  db.query(getArticleTotalSql, (err,result) => {
    if (err) {
      return next(err)
    }
    articleTotal = result[0].total
  })

  db.query(dealgetArticleListSql, (err,result) => {
    if (err) {
      return next(err)
    }
    res.send({
      code: 200,
      data: result,
      total:articleTotal
    })
  })
})

router.get('/getBaseInfo', function (req, res, next) {
  let baseInfoSql = `select * from blog_baseInfo where id = 1025`
  db.query(baseInfoSql, (err, result) => {
    if (err) {
      return next(err)
    }
    console.error(result)
    res.send({
      code: 200,
      data:result[0]
    })
  })
})

router.post('/login', (req, res, next) => {
  res.send({
    code: 200,
    data:'admin-token'
  })
})

router.get('/getInfo', (req, res, next) => {
  res.send({
    code: 200,
    data: {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
  })
})

module.exports = router;
