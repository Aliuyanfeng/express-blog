var db = require('../config/db')

// 博客展示数据行为类
class IndexService {
    // 获取基础信息 首页
    async getBaseInfo() {
        return await new Promise((resolve, reject) => {
            let baseInfoSql = `select * from blog_baseInfo where id = 1025`
            db.query(baseInfoSql, (err, result) => {
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
    };
    // 获取文章列表
    async getArticleList(form) {
        return await new Promise(async (resolve, reject) => {

            var npagesize = (form.page - 1) * 10

            const getArticleListSql = `select * from blog_article_list limit ${npagesize},${form.limit}`

            const getPubishArticleListSql = `select * from blog_article_list where article_status = 'published' limit ${npagesize},${form.limit}`

            const getArticleTotalSql = `select count(*) as total from blog_article_list`

            var articleTotal;

            if (form.type == 1) {
                var dealgetArticleListSql = getArticleListSql
            } else {
                var dealgetArticleListSql = getPubishArticleListSql
            }

            await db.query(getArticleTotalSql, (err, result) => {
                if (err) {
                    return next(err)
                }
                articleTotal = result[0].total
            })

            await db.query(dealgetArticleListSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve({result,articleTotal})
               
            })
        }).then(data => {
            return data
        }, error => {
            return error
        })
    };
    // 获取分类下的所有笔记
    async getNote(form) {
        return await new Promise((resolve, reject) => {
            let getNoteSql = `select * from blog_note_list where note_classify_id = ${form.id}`
            db.query(getNoteSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                result.map((item, index) => {
                    item.note_html = Buffer.from(item.note_html, "base64").toString();
                    item.note_md = Buffer.from(item.note_md, "base64").toString();
                })
                resolve(result)
            })
        }).then((data) => {
            return data
        }, ((error) => {
            return error
        }))
    }
}



module.exports = IndexService