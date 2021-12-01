
// 数据库查询业务分离出来
var db = require('../config/db')

class AdminService {
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
        },((error) => {
            return error
        }))
    }
}

module.exports = AdminService