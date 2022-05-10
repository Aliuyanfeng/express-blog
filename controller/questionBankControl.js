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

const questionBankService = require('../service/questionBankService')
// 题库模块
module.exports = {
    //获取题库页面基础信息
    async getQuestionBaseInfo(req, res) {
        await questionBankService.getQuestionBaseInfo().then(data => {
            res.send({
                code: 200,
                question_total: data.question_result.total,
                classify_total: data.classify_result.total,
                classify_data: data.classify_data
            })
        })

    },

    //获取所有题目
    getAllQuestion(req, res) {
        questionBankService.getAllQuestion(req.query).then(data => {
            res.send({
                code: 200,
                data: data.result,
                total: data.questionTotal
            })
        })
    },


    // 删除题目
    deleteQuestion(req, res) {
        questionBankService.deleteQuestion(req.query).then(data => {
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
    },

    // 获取指定题目
    getQuestionDetail(req, res) {
        questionBankService.getQuestionDetail(req.params).then(data => {
            if (data) {
                res.send({
                    code: 200,
                    result: data[0]
                })
            }
        })
    },


    //更新题目
    updateQuestion(req, res) {
        questionBankService.updateQuestion(req.body).then(data => {
            if (data) {
              res.send({
                code: 200,
                info: '更新成功'
              })
            } else {
              res.send({
                code: 400,
                info: '更新失败'
              })
            }
          })
    },

    // 发布题目
    addQuestion(req, res) {
        questionBankService.addQuestion(req.body).then(data => {
            console.log(data)
            if (data.insertId > 0) {
              res.send({
                code: 200,
                info: '发布成功'
              })
            } else {
              res.send({
                code: 400,
                info: '发布失败'
              })
            }
          })
    },
}