var express = require('express');
var router = express.Router();

const AdminService = require('../service/adminService')

var adminService = new AdminService()

/* GET users listing. */
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
  res.send('respond with a resource');
});

// 获取所有文章分类
router.get('/getAllCategory', function(req, res, next){
  adminService.getAllCategory().then((data) => {
    res.send({
      code: 200,
      data:data
    })
  })
})
// 创建文章
router.post('/addArticle', (req, res, next) => {
  let body = req.body
  // 判断不为空
  if (!req.body.title) {
    res.send({
      code: 400,
      info:"文章标题不能为空！"
    })
  }
  if (!req.body.display_time) {
    res.send({
      code: 400,
      info:"文章发布时间不能为空！"
    })
  }
  if (!body.author) body.author = '刘艳峰'
  if (!body.content_short) body.content_short = "该文章暂无描述~"
  adminService.addArticle(body).then(data => {
    res.send({
      code: 200,
      data:'admin-token'
    })
  })
})
// 获取指定文章
router.post('/getArticleDetail', async (req,res,next) => {
  adminService.getArticleDetail(req.body).then(data => {
    res.send({
      code: 200,
      data:data
    })
  })
})

// 更新文章
router.post('/updateArticle', async (req, res, next) => {
  adminService.updateArticle(req.body).then(data => {
    console.log(data)
    if (data) {
      if (data.changedRows > 0) {
        res.send({
          code: 200,
          info:"文章修改成功"
        })
      } else {
        res.send({
          code: 200,
          info:"文章暂无修改"
        })
      }
    } else {
      res.send({
        code: 200,
        info:"数据有误，稍后重试"
      })
    }
    
  })
})

// 获取所有作者
router.get('/getAllAuthor', async (req, res, next) => {
  adminService.getAllAuthor().then(data => {
    res.send({
      code:200,
      data:data
    })
  })
})
module.exports = router;
