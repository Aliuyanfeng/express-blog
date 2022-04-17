// 控制层 负责接受req 处理好的参数传给service  返回res
const AdminService = require('../service/adminService')

const UserService = require('../service/userService')

const IndexService = require('../service/indexService');

var indexService = new IndexService()

var adminService = new AdminService()

var userService = new UserService()

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
    }
    
}