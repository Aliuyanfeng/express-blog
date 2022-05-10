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
	},

	// 删除题目
	async deleteQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deleteQuestionSql = `delete from blog_question_list where id = ${form.id}`

			db.query(deleteQuestionSql, (err, result) => {
				if (err) {
					reject(err)
				}
				resolve(result)
			})
		}).then(data => {
			if (data.affectedRows == 0) {
				return 0
			} else {
				return 1
			}

		}, error => {
			return error
		})
	},

	//获取指定题目
	async getQuestionDetail(form) {
		return await new Promise((resolve, reject) => {
			let getQuestionDetailSql = `select * from blog_question_list where id = ${form.id}`
			db.query(getQuestionDetailSql, (err, result) => {
				if (err) {
					return next(err)
				}
				result[0].question_stem = Buffer.from(result[0].question_stem, "base64").toString();
				result[0].question_answer = Buffer.from(result[0].question_answer, "base64").toString();
				resolve(result)
			})
		}).then(data => {
			return data
		}, (err => {
			return err
		}))
	},


	//更新题目
	async updateQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deal_answer = Buffer.from(form.question_answer).toString('base64')
			let deal_stem = Buffer.from(form.question_stem).toString('base64')
			let updateQuestionSql =
				`update blog_question_list set 
                            question_type = "${form.question_type}",
                            question_stem = "${deal_stem}",
                            question_answer = "${deal_answer}",
                            question_classify = "${form.question_classify}"
                            where id = ${form.id}`
			db.query(updateQuestionSql, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then(data => {
			return data
		}).catch(error => {
			return error
		})
	},


	// 发布题目
	async addQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deal_answer = Buffer.from(form.question_answer).toString('base64')
			let deal_stem = Buffer.from(form.question_stem).toString('base64')
			let addQuestionSql =
				`INSERT INTO blog_question_list (question_type,question_stem,question_answer,question_classify) 
                                VALUES ('${form.question_type}','${deal_stem}','${deal_answer}','${form.question_classify}')
                                `
			db.query(addQuestionSql, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then(data => {
			return data
		}).catch(error => {
			return error
		})
	}
	
}