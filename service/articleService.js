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
	},

	// 创建文章/题目分类
	async createCategory(form) {
		return new Promise(async (resolve, reject) => {
			let create_result = await db.insert('blog_article_classify',form)
			console.log(create_result)
			if(create_result){
				resolve(create_result)
			}else{
				reject('create classify is failed')
			}
		})
	},

	//删除文章/题库分类
	deleteCategory(form){
		return new Promise(async (resolve,reject)=>{
			let delete_result = await db.delete('blog_article_classify',form.id)
			console.log(delete_result)
			if(delete_result){
				resolve(delete_result)
			}else{
				reject('delete classify is failed')
			}
		})
	}
}