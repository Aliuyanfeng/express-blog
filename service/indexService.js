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

            var npagesize = (form.page - 1) * (form.limit)

            const getArticleListSql = `select * from blog_article_list order by case when article_importance=3 then 1 else 2 end, article_createtime desc limit ${npagesize},${form.limit}`

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
    // 点赞
    async submitLike(form) {
        return new Promise(async (resolve, reject) => {
            db.query(`select * from blog_like_record where ip='${form.ip}' and article_id='${form.article_id}'`, function (err, result) {
                if (result.length > 0) {
                    reject('submitLike is failed')
                } else {
                    let like_result =  db.insert('blog_like_record',form)
                    if (like_result) {
                        db.query(`select * from blog_article_list where id = ${form.article_id}`, function (err, result) {
                            console.log(result[0].article_like + 1)
                            let update_result = db.update('blog_article_list', {
                                id: form.article_id,
                                article_like:result[0].article_like + 1
                            })
                            if (update_result) {
                                resolve(update_result)
                            }
                        })
                        
                    }else{
                        reject('submitLike is failed')
                    }
                }
            })
			
		})
    };
    //添加访客记录
    async addVisitorRecord(form) {
        return new Promise(async (resolve, reject) => {
            
            let visitor_result =  db.insert('blog_visitors_record',form)
            if(visitor_result){
                resolve(visitor_result)
            }else{
                reject('Add Visitor Record is Failed')
            }
			
		})
    };

}



module.exports = IndexService