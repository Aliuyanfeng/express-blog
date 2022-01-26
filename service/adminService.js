
// 后台管理接口行为类
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
                if (result.length > 0) {
                    // console.log(typeof result.article_content)
                    let str = result[0].article_content
                    result[0].article_content = Buffer.from(str,"base64").toString();
                    resolve(result)
                } else {
                    resolve(result)
                }
                
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
    };
    // 添加笔记一级分类
    async addNoteCategory(form) {
        return await new Promise((resolve, reject) => {
            let addNoteCategorySql =  
            `INSERT INTO blog_note_classify (classify_name,pid,children) 
            VALUES ('${form.name}','${form.parent_id == "" ? 0 : form.parent_id}',0)
            `

            db.query(addNoteCategorySql, (err, result)=> {
                if(err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then(data => {
            console.log(data)
            return data
           
        }, error => {
            return error
        })
    };
    // 获取笔记分类数据
    async getNoteCategory() {
        return await new Promise((resolve, reject) => {
            let getNoteCategorySql =  `select * from blog_note_classify`

            db.query(getNoteCategorySql, (err, result)=> {
                if(err) {
                    reject(err)
                }
                resolve(result)
            })
        }).then(data => {
            
            let tempData = []; //处理后的数据

            let firstData = [];//一级分类
            let secondData = [];//二级/三级分类

            data.map(item => {
                if (item.pid == 0) {
                    firstData.push(item)
                    let tempObj = {
                        id: item.id,
                        name: item.classify_name,
                        children:[]
                    }
                    tempData.push(tempObj)
                } else { 
                    secondData.push(item)
                }
            })
            
            secondData.map(item => {
                tempData.map(item2 => {
                    if (item.pid == item2.id) {
                        let tempObj = {
                            id: item.id,
                            name: item.classify_name,
                            children:[]
                        }
                        item2.children.push(tempObj)
                    }
                })
            })

            tempData.map(item => {
                item.children.map(item2 => {
                    secondData.map(item3 => {
                        if (item2.id == item3.pid) {
                            let tempObj = {
                                id: item3.id,
                                name: item3.classify_name,
                            }
                            item2.children.push(tempObj)
                        }
                    })
                })
            })


            return tempData
        }, error => {
            return error
        })
    };
    // 编辑笔记分类
    async editNoteCategory(form) {
        return await new Promise((resolve, reject) => {
            let editNoteCategorySql =  
            `UPDATE blog_note_classify set
            classify_name = "${form.name}"
            where id = ${form.id}
            `

            db.query(editNoteCategorySql, (err, result)=> {
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
    };
    // 删除笔记分类
    async delNoteCaegory(form) {
        return await new Promise((resolve, reject) => {
            let delNoteCaegorySql =  `delete from blog_note_classify where id = ${form.id}`

            db.query(delNoteCaegorySql, (err, result)=> {
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
    };
    // 发布笔记
    async publishNote(form) {
        return await new Promise((resolve, reject) => {
            let publishNoteSql = `INSERT INTO blog_note_list (note_name,note_md,note_html,note_classify_id) 
                                VALUES ('${form.name}','${form.md}','${form.html}','${form.parent_id}')
                                `
            db.query(publishNoteSql, (err, result) => {
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
    }
}

module.exports = AdminService