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

router.get('/getAllCategory', function(req, res, next){
  adminService.getAllCategory().then((data) => {
    res.send({
      code: 200,
      data:data
    })
  })
})

router.post('/getArticleDetail', async (req,res,next) => {
  adminService.getArticleDetail(req.body).then(data => {
    res.send({
      code: 200,
      data:data
    })
  })
})

module.exports = router;
