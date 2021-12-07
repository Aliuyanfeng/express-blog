
// 数据库查询业务分离出来
var db = require('../config/db')

class AdminService {
    // 获取所有分类
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
    // 添加文章
    async addArticle(form) {
        return await new Promise((resolve, reject) => {
            let data = form
            let deal_article_tag = data.platforms.join(',');
            let deal_article_comment = !data.comment_disabled ? 0 : 1;
            let deal_article_content = Buffer.from(data.content).toString('base64')
            let insertArticle = `INSERT INTO blog_article_list (article_title,article_description,article_createtime,article_like,article_read,article_tag,article_cover,article_status,article_content,article_comment,article_author) 
                                VALUES ('${data.title}','${data.content_short}','${data.display_time}',0,0,'${deal_article_tag}','${data.image_uri}','${data.status}','${deal_article_content}','${deal_article_comment}','${data.author}')
                                `
            db.query(insertArticle, (err, result) => {
                if (err) {
                return next(err)
                }
                resolve(result)
            })
        }).then((data) => {
            return data
        },((error) => {
            return error
        }))
    };
    // 获取指定文章
    async getArticleDetail(form) {
        return await new Promise((resolve, reject) => {
            let getArticleDetailSql = `select * from blog_article_list where id = ${form.id}`
            db.query(getArticleDetailSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                console.log(result)
                // console.log(typeof result.article_content)
                let str = result[0].article_content
                result[0].article_content = Buffer.from(str,"base64").toString();
               
                resolve(result)
            })
        }).then((data) => {
            return data
        },((error) => {
            return error
        }))
    };
    // 更新指定文章
    async updateArticle(form) {
        let deal_platforms = form.platforms.join(',')
        let deal_article_comment = form.comment_disabled ? 1 : 0
        let deal_article_content = Buffer.from(form.content).toString('base64')

        return await new Promise((resolve, reject) => {
            let updateArticleSql = `update blog_article_list set 
                            article_title = "${form.title}",
                            article_description = "${form.content_short}",
                            article_createtime = "${form.display_time}",
                            article_tag = "${deal_platforms}",
                            article_cover = "${form.image_uri}",
                            article_status = "${form.status}",
                            article_content = "${deal_article_content}",
                            article_comment = "${deal_article_comment}",
                            article_author = "${form.author}"
                            where id = ${form.id}`
            db.query(updateArticleSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then(data => {
            return data
        }, (error => {
            return error
        }))
    };
    // 获取所有作者
    async getAllAuthor() {
        return await new Promise((resolve, reject) => {
            let getAllAuthorSql = `select distinct article_author from blog_article_list`
            db.query(getAllAuthorSql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then(data => {
            return data
        }, (error => {
            return error
        }))
    };
    // 删除文章
    async deleteArticle(form) {
        return await new Promise((resolve, reject) => {
            let deleteArticleSql = `delete from blog_article_list where id = ${form.id}`

            db.query(deleteArticleSql, (err, result)=> {
                if(err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then(data => {
           
            if (data.changedRows == 0) {
                return 0
            } else {
                return 1
            }
           
        }, error => {
            return error
        })
    }
}

module.exports = AdminService