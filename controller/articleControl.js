// 控制层 负责接受req 处理好的参数传给service  返回res
const ArticleService = require('../service/articleService')


const articleService = new ArticleService()
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
    }
}