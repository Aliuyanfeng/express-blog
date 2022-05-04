var db = require('../config/db')

module.exports = {
    // 搜索文章
    async searchArticle(form) {
        return await new Promise(async (resolve, reject) => {
            let findResult = await db.findBySql(`select * from blog_article_list where article_title like '%${form.keyword}%';`).catch(err => {
                reject(err)
            })
            if (findResult) {
                resolve(findResult)
            }
        })
    },

    // 获取所有文章/题库分类
	async getAllCategory() {
		return await new Promise((resolve, reject) => {
			let allCategorySql = `select * from blog_article_classify`
			db.query(allCategorySql, (err, result) => {
				if (err) {
					reject(err)
				}
				resolve(result)
			})
		}).then((data) => {
			return data
		}, ((error) => {
			return error
		}))
	},

	// 获取文章详情
	async getArticleDetail(form) {
		return await new Promise((resolve, reject) => {
			let getArticleDetailSql = `select * from blog_article_list where id = ${form.id}`
			db.query(getArticleDetailSql, (err, result) => {
				if (err) {
					reject(err)
				}
				console.log(result)
				if (result.length > 0) {
					// console.log(typeof result.article_content)
					let str = result[0].article_content
					result[0].article_content = Buffer.from(str, "base64").toString();
					resolve(result)
				} else {
					resolve(result)
				}

			})
		})
	}
}