// 控制层 负责接受req 处理好的参数传给service  返回res
const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService');

var indexService = new IndexService()

var adminService = new AdminService()

var userService = new UserService()

module.exports = {
    // 更新banner
    updateBanner(req, res) {
        adminService.upDateBanner(req.body).then(data => {
            if (data.affectedRows > 0) {
                res.send({
                    code: 200,
                    info: '更新Banner成功'
                })
            } else {
                res.send({
                    code: 400,
                    info: '更新Banner失败'
                })
            }
        })
    },

    //获取首页基础信息
    getBaseInfo(req, res) {
        indexService.getBaseInfo().then(data => {
            if (data) {
                res.send({
                    code: 200,
                    data: data[0]
                })
            }
        })
    },

    // 更新首页基本信息
    updateBaseInfo(req, res) {
        adminService.updateBaseInfo(req.body).then(data => {
            console.log(data)
            if (data) {
                res.send({
                    code: 200,
                    info: '更新成功',
                })
            } else {
                res.send({
                    code: 200,
                    info: '更新失败',
                })
            }

        })
    }
}