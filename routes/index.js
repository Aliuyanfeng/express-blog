const { Router } = require('express');
var express = require('express');
var router = express.Router();
var db = require('../config/db')
var createError = require('http-errors');


const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService')

var indexService = new IndexService()

var adminService = new AdminService()

var userService = new UserService()


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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi Welcome to My Blog' });
});
// 前台测试接口
router.get('/test', async function(req, res, next) {
  let {total} = await db.findTotal('blog_question_list')
  console.log(total)
  res.send({
    code:200,
    obj:'哈哈',
	total:total
  })  
});
// 获取文章列表
router.get('/getArticleList', async (req, res, next) => {

  indexService.getArticleList(req.query).then(data => {
    res.send({
        code: 200,
        data: data.result,
        total: data.articleTotal
    })
  })
})
// 获取首页基础信息
router.get('/getBaseInfo', function (req, res, next) {
  indexService.getBaseInfo().then(data => {
    if (data) {
      res.send({
        code: 200,
        data:data[0]
      })
    }
  })
})
// 获取文章详情
router.post('/getArticleDetail', async (req,res,next) => {
  adminService.getArticleDetail(req.body).then(data => {
    let info = data.length > 0 ? '查询成功' : '暂无数据'
    res.send({
      code: 200,
      data: data,
      info:info
    })
  })
})

// 获取所有文章分类
router.get('/getAllCategory', function(req, res, next){
  adminService.getAllCategory().then((data) => {
    res.send({
      code: 200,
      data:data
    })
  })
})
// 获取笔记所有分类
router.get('/getNoteCategory', async (req, res, next) => {
  adminService.getNoteCategory().then(data => {
    res.send({
      code: 200,
      info: '查询成功',
      data:data
    })
  })
})
// 获取指定分类下的笔记
router.post('/getNote', async (req, res, next) => {
  console.log(req.body)
  indexService.getNote(req.body).then(data => {
    res.send({
      code: 200,
      data: data,
      info:"查询成功"
    })
  })
})

//获取题库页面基础信息
router.post('/getQuestionBaseInfo',async (req, res, next) => {
	let question_result = await db.findTotal('blog_question_list')
	let classify_result = await db.findTotal('blog_article_classify')
	
	let classify_data = await db.find('blog_article_classify')
	res.send({
		code:200,
		question_total:question_result.total,
		classify_total:classify_result.total,
		classify_data
	})
})

//错误处理
router.get('*',function (req,res,next) {
  // res.status(404).send('404 Not Found')
  res.render("error.html")
  // next(createError(404));
});

module.exports = router;
