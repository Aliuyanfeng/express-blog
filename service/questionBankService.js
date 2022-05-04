var db = require('../config/db')

module.exports = {
    //获取题库页面基础信息
    getQuestionBaseInfo() {
        return new Promise(async (resolve, reject) => {
            let question_result = await db.findTotal('blog_question_list').catch( err => reject(err) )
            let classify_result = await db.findTotal('blog_article_classify').catch( err => reject(err) )
            let classify_data = await db.find('blog_article_classify').catch(err => reject(err))
            resolve({
                question_result,
                classify_result,
                classify_data
            })
		})
    }
}