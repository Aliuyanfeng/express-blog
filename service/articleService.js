var db = require('../config/db')

class articleService {
    async searchArticle(form) {
        return await new Promise(async (resolve, reject) => {
            let findResult = await db.findBySql(`select * from blog_article_list where article_title like '%${form.keyword}%';`).catch(err => {
                reject(err)
            })
            if (findResult) {
                resolve(findResult)
            }
		})
    }
}


module.exports = articleService