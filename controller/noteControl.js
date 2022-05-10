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

const noteService = require('../service/noteService')
// 笔记模块
module.exports = {
    // 获取指定分类下的笔记
    async getNote(req, res) {
        await noteService.getNote(req.body).then(data => {
            res.send({
                code: 200,
                data: data,
                info: "查询成功"
            })
        })

    },
    // 获取笔记所有分类
    async getNoteCategory(req, res) {
        await noteService.getNoteCategory().then(data => {
            res.send({
                code: 200,
                info: '查询成功',
                data: data
            })
        })
    },

    // 发布笔记
    publishNote(req, res) {
        noteService.publishNote(req.body).then(data => {
            res.send({
                code: 200,
                info: "发布成功"
            })
        })
    },

    // 获取笔记所有分类
    getNoteCategory(req, res) {
        noteService.getNoteCategory().then(data => {
            res.send({
                code: 200,
                info: '查询成功',
                data: data
            })
        })
    }

}