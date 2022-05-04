// 控制层 负责接受req 处理好的参数传给service  返回res
const articleService = require('../service/articleService')

const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService');

const AnalysisService = require('../service/analysisService')

const indexService = new IndexService()

const adminService = new AdminService()

const userService = new UserService()

const analysisService = new AnalysisService()

// 文章模块
module.exports = {
  // 文章模糊搜索
  searchArticle(req, res) {
    articleService.searchArticle(req.body).then(data => {
      res.send({
        code: 200,
        data,
        info: '查询成功'
      })
    }).catch(err => {
      res.send(err)
    })
  },

  // 用户文章点赞
  submitLikeBiuBiuBiu(req, res) {
    indexService.submitLike(req.body).then(data => {
      if (data.affectedRows > 0) {
        res.send({
          code: 200,
          info: '点赞成功'
        })
      } else {
        res.send({
          code: 400,
          info: '点赞失败'
        })
      }
    }, err => {
      if (err) {
        res.send({
          code: 400,
          info: '您已经点过赞啦'
        })
      }
    })
  },

  // 获取文章/题库分类
  getAllCategory(req, res) {
    articleService.getAllCategory().then((data) => {
      res.send({
        code: 200,
        data:data
      })
    })
  },

  //获取文章详情
  getArticleDetail(req, res) {
    articleService.getArticleDetail(req.body).then(data => {
      let info = data.length > 0 ? '查询成功' : '暂无数据'
      res.send({
        code: 200,
        data: data,
        info:info
      })
    })
  },


  // 获取文章列表
  getArticleList(req, res) {
    indexService.getArticleList(req.query).then(data => {
      res.send({
          code: 200,
          data: data.result,
          total: data.articleTotal
      })
    })
  },


  // 创建文章/题目分类
	createCategory(req, res) {
		articleService.createCategory(req.body).then(data => {
      console.log(data)
      if (data.affectedRows > 0) {
        res.send({
          code: 200,
          info:'添加分类成功'
        })
      } else {
        res.send({
          code: 400,
          info:'添加分类失败'
        })
      }
    })
  },
  
  // 删除文章/题目分类
  deleteCategory(req, res) {
    articleService.deleteCategory(req.body).then(data => {
      console.log(data)
      if(data.affectedRows > 0){
        res.send({
          code:200,
          info:'删除成功'
        })
      }else{
        res.send({
          code:400,
          info:'删除失败'
        })
      }
    })
  },
  
  // 更新文章/题目分类
  updateCategory(req, res) {
    adminService.updateCategory(req.body).then(data => {
      if(data){
        res.send({
          code:200,
          info:'更新成功'
        })
      }
    })
  }
}