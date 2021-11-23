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

/* GET home page. */
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

  const getArticleListSql =  `select * from blog_article_list limit ${npagesize},10`
 
  const getArticleTotalSql = `select count(*) as total from blog_article_list`

  var articleTotal;
  await db.query(getArticleTotalSql, (err,result) => {
    if (err) {
      return next(err)
    }
    articleTotal = result[0].total
  })

  await db.query(getArticleListSql, (err,result) => {
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

router.get('/getBaseInfo', (req, res, next) => {
  let baseInfoSql = `select * from blog_baseInfo`
  db.query(baseInfoSql, (err, result) => {
    if (err) {
      return next(err)
    }
    console.error(result)
    res.send({
      code: 200,
      data:result
    })
  })
})


module.exports = router;
