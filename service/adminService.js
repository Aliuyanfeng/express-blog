
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
    };
    async getArticleDetail(form) {
        return await new Promise((resolve, reject) => {
            let getArticleDetailSql = `select * from blog_article_list where id = ${form.id}`
            db.query(getArticleDetailSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                console.log(result)
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