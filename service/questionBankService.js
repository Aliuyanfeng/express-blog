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
    },
    //获取所有题目
	async getAllQuestion(form) {
		return await new Promise(async (resolve, reject) => {

			var npagesize = (form.page - 1) * 10

			const getAllQuestionSql = `select * from blog_question_list limit ${npagesize},${form.limit}`

			const getAllQuestionTotalSql = `select count(*) as total from blog_question_list`

			var questionTotal;


			await db.query(getAllQuestionTotalSql, (err, result) => {
				if (err) {
					return next(err)
				}
				questionTotal = result[0].total
			})

			await db.query(getAllQuestionSql, (err, result) => {
				if (err) {
					reject(err)
				}

				// switch base64 to string Buffer.from(result[0].question_stem, "base64").toString();
				result = result.map((item, index) => {
					item.question_stem = Buffer.from(item.question_stem, "base64").toString()
					item.question_answer = Buffer.from(item.question_answer, "base64").toString()
					return item
				})
				resolve({
					result,
					questionTotal
				})

			})
		})
	}
}