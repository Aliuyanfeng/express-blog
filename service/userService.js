
var db = require('../config/db')

class UserService {
     // 登陆
    async logIn(form) {
        return await new Promise((resolve, reject) => {
             let loginSql = `select * from blog_admin where username = "${form.username}"`
             db.query(loginSql, (err, result) => {
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
}



module.exports = UserService