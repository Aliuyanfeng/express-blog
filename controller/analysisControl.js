// 控制层 负责接受req 处理好的参数传给service  返回res
const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService');

const AnalysisService = require('../service/analysisService')

var indexService = new IndexService()

var adminService = new AdminService()

var userService = new UserService()

var analysisService = new AnalysisService()

module.exports = {
    // 获取数据分析
    getAnalysisIndex(req,res) {
        adminService.getAnalysisIndex().then(data => {
            if (data) {
                res.send({
                    code: 200,
                    obj: data
                })
            }
        }).catch(err => {
            res.send(err)
        })
    },

    // 获取点赞记录
    getLikeList(req, res) {
        analysisService.getLikeList(req.body).then(data => {
            // console.log(data)
            if (data) {
                res.send({
                    code: 200,
                    obj: data,
                    info:"获取数据成功"
                })
            } else {
                res.send({
                    code: 400,
                    info:"获取数据失败"
                })
            }
        })
    },

    // 获取访客记录
    getVisitorList(req, res) {
        analysisService.getVisitorList(req.body).then(data => {
            // console.log(data)
            if (data) {
                res.send({
                    code: 200,
                    obj: data,
                    info:"获取数据成功"
                })
            } else {
                res.send({
                    code: 400,
                    info:"获取数据失败"
                })
            }
        })
    },

    // 添加访客记录
    isVisitorWithWebSite(req, res) {
        indexService.addVisitorRecord(req.body).then(data => {
            if (data.affectedRows > 0) {
              res.send({
                code: 200,
                info:'Welcome to have fun ~'
              })
            } else {
              res.send({
                code: 400,
                info:'is Add Failed'
              })
            }
          })
    }
    
}