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
            if(data.affectedRows > 0){
                res.send({
                    code: 200,
                    info:'更新Banner成功'
                })
            } else {
                res.send({
                    code: 400,
                    info:'更新Banner失败'
                })
            }
        })
    }
}