var db = require('../config/db')

class AnalysisService {
    async getLikeList(form) {
        return await new Promise(async (resolve, reject) => {
            let npagesize = (form.page - 1) * (form.limit)
            let findResult = await db.findBySql(`select * from blog_like_record where id > (select id from blog_like_record order by id limit ${npagesize}, 1) limit ${form.limit};`).catch(err => {
                reject(err)
            })
            let likeTotal = await db.findTotal('blog_like_record')
            if (findResult) {
                resolve({
                    data: findResult,
                    total: likeTotal.total
                })
            }
		})
    }

    async getVisitorList(form) {
        return await new Promise(async (resolve, reject) => {
            let npagesize = (form.page - 1) * (form.limit)
            let findResult = await db.findBySql(`select * from blog_visitors_record where id > (select id from blog_visitors_record order by id limit ${npagesize}, 1) limit ${form.limit};`).catch(err => {
                reject(err)
            })
            let likeTotal = await db.findTotal('blog_visitors_record')
            if (findResult) {
                resolve({
                    data: findResult,
                    total: likeTotal.total
                })
            }
		})
    }
}


module.exports = AnalysisService