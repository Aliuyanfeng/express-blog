const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
var multipart = require('connect-multiparty');

const { imageFilter,imageLimit,baseStorage,normalStorage } = require('../config/upload.js')
//加载配置
var mainUploader = multer({
  storage: baseStorage,
  fileFilter: imageFilter,
  limits: imageLimit
})

var multipartMiddleware = multipart();

const {
  PRIVITE_KEY,
  EXPIRESD
} = require('../config/secret.js')

const {
  uploadUrl,
  baseUploadUrl,
  normalUploadUrl
} = require('../config/base.js')

const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService')

var indexService = new IndexService()

var adminService = new AdminService()

var userService = new UserService()

// 路由请求配置
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

router.get('/test', function (req, res, next) {
  res.send({
    code: 200,
    info: "test is successful"
  });
});

// 用户登陆
router.post('/user/login', function (req, res, next) {
  userService.logIn(req.body).then(data => {
    if (data.length > 0) {
      const token = 'Bearer ' + jwt.sign({
        _id: data.id,
        admin: data.username
      },
        PRIVITE_KEY, {
        expiresIn: EXPIRESD
      }
      )

      res.send({
        code: 200,
        data: 'admin-token',
        token: token
      })
    }
  })
})
// 测试解密token
router.post('/verifyTest', function (req, res, next) {
  res.send({
    code: 200,
    data: 'token哈哈哈哈',
  })
})
// 退出登陆
router.post('/user/logout', function (req, res, next) {
  res.send({
    code: 200,
    info: "logout is successful"
  });
})

// 获取所有文章分类
router.get('/getAllCategory', function (req, res, next) {
  adminService.getAllCategory().then((data) => {
    res.send({
      code: 200,
      data: data
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
      info: "文章标题不能为空！"
    })
  }
  if (!req.body.display_time) {
    res.send({
      code: 400,
      info: "文章发布时间不能为空！"
    })
  }
  if (!body.author) body.author = '刘艳峰'
  if (!body.content_short) body.content_short = "该文章暂无描述~"
  adminService.addArticle(body).then(data => {
    res.send({
      code: 200,
      data: 'admin-token'
    })
  })
})
// 获取指定文章
router.post('/getArticleDetail', async (req, res, next) => {
  adminService.getArticleDetail(req.body).then(data => {
    let info = data.length > 0 ? '查询成功' : '暂无数据'
    res.send({
      code: 200,
      data: data,
      info: info
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
          info: "文章修改成功"
        })
      } else {
        res.send({
          code: 200,
          info: "文章暂无修改"
        })
      }
    } else {
      res.send({
        code: 200,
        info: "数据有误，稍后重试"
      })
    }

  })
})

// 获取所有作者
router.get('/getAllAuthor', async (req, res, next) => {
  adminService.getAllAuthor().then(data => {
    res.send({
      code: 200,
      data: data
    })
  })
})

// 删除指定文章
router.get('/deleteArticle', async (req, res, next) => {
  console.error(req.query)
  adminService.deleteArticle(req.query).then(data => {
    if (data == 1) {
      res.send({
        code: 200,
        info: '删除成功',
      })
    } else {
      res.send({
        code: 200,
        info: '参数有误',
      })
    }

  })

})
// 获取后台管理员基础信息
router.post('/user/getInfo', (req, res, next) => {
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


// 创建笔记分类
router.post('/addNoteCategory', async (req, res, next) => {

  console.log(req.body)
  adminService.addNoteCategory(req.body).then(data => {
    console.log(data)
    res.send({
      code: 200,
      info: "添加成功"
    })
  })

})

// 更新笔记分类
router.post('/editNoteCategory', async (req, res, next) => {
  console.log(req.body)
  adminService.editNoteCategory(req.body).then(data => {
    console.log(data)
    if (data) {
      res.send({
        code: 200,
        inof: '更新成功',
      })
    } else {
      res.send({
        code: 200,
        inof: '更新失败',
      })
    }

  })

})

// 删除笔记分类
router.post('/delNoteCaegory', async (req, res, next) => {
  adminService.delNoteCaegory(req.body).then(data => {
    if (data == 1) {
      res.send({
        code: 200,
        info: '删除成功',
      })
    } else {
      res.send({
        code: 200,
        info: '参数有误',
      })
    }
  })
})
// 获取笔记所有分类
router.get('/getNoteCategory', async (req, res, next) => {
  adminService.getNoteCategory().then(data => {
    res.send({
      code: 200,
      inof: '查询成功',
      data: data
    })
  })
})


// 发布笔记
router.post('/publishNote', async (req, res, next) => {
  console.log(req.body)
  adminService.publishNote(req.body).then(data => {
    res.send({
      code: 200,
      info: "发布成功"
    })
  })

})

// 上传图片
router.post('/upload',(req, res, next) => {
  // console.log(req.body)
  // console.log(req.file)
  let imgUploader = mainUploader.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ])
  imgUploader(req, res, function (err) {
    console.log(req.body)
    // console.log(req.files)
    // 如果发生错误 判断错误的种类 1内置 2自生成
    if (!!err) {
      // 1
      if (err instanceof multer.MulterError) {
        res.send({
          code: 400,
          info: err.message,
          infoStatus: err.code
        })
      // 2
      } else if (err) {
        res.send({
          code: 400,
          err: err,
          info: "Only jpeg or png images allowed！"
        })
        return
      }
    } else {
      res.send({
        code: 200,
        obj: {
          req: req.files,
          filePath: baseUploadUrl + req.files[req.body.type][0].filename
        }
      })
    }
  })

})
// 测试图片上传表单
router.get('/form', function (req, res, next) {
  var form = fs.readFileSync(path.join(__dirname, "./form.html"), {
    encoding: 'utf8'
  });
  res.send(form);
});
//错误处理
router.get('*', function (req, res, next) {
  res.render("error.html")
});

module.exports = router;