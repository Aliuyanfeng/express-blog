var express = require('express');

var router = express.Router();

var db = require('../config/db')

const articleControl = require('../controller/articleControl')

const analysisControl = require('../controller/analysisControl')

const questionBankControl = require('../controller/questionBankControl')

const noteControl = require('../controller/noteControl');

const baseInfoControl = require('../controller/baseInfoControl');

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
    res.send(200); //让options尝试请求快速结束
  else
    next();
});

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Hi Welcome to My Blog'
  });
});
// 前台测试接口
router.get('/test', async function (req, res, next) {
  let {
    total
  } = await db.findTotal('blog_question_list')
  res.send({
    code: 200,
    obj: '哈哈',
    total: total
  })
});
// 获取文章列表
router.get('/getArticleList', articleControl.getArticleList)

// 获取首页基础信息
router.get('/getBaseInfo', baseInfoControl.getBaseInfo)

// 获取文章详情
router.post('/getArticleDetail', articleControl.getArticleDetail)

// 获取所有文章/题库分类
router.get('/getAllCategory', articleControl.getAllCategory)

// 获取笔记所有分类
router.get('/getNoteCategory', noteControl.getNoteCategory)

// 获取指定分类下的笔记
router.post('/getNote', noteControl.getNote)

//获取题库页面基础信息
router.get('/getQuestionBaseInfo', questionBankControl.getQuestionBaseInfo)

// 用户点赞
router.post('/submitLikeBiuBiuBiu', articleControl.submitLikeBiuBiuBiu)

// 添加访问记录
router.post('/isVisitorWithWebSite', analysisControl.isVisitorWithWebSite)

// 文章模糊搜索
router.post('/searchArticle', articleControl.searchArticle)

//错误处理
router.get('*', function (req, res, next) {
  // res.status(404).send('404 Not Found')
  res.render("error.html")
  // next(createError(404));
});

module.exports = router;