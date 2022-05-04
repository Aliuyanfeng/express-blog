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
                code:200,
                question_total:data.question_result.total,
                classify_total:data.classify_result.total,
                classify_data:data.classify_data
            })
        })
       
    },

}