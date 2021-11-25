var mysql = require('mysql')

var pool = mysql.createPool({
    host: '59.110.241.135',
    port: 3306,
    user: 'root',
    password: 'aliuyanfeng0125',
    database: 'vue3-blog',
    timezone:"08:00"
});
// pool.on('acquire', function (connection) {
//     console.log('Connection %d acquired', connection.threadId);
// });
// pool.on('connection', function (connection) {
//     connection.query('SET SESSION auto_increment_increment=1')
// });

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err, rows) {
            if (err) {
                return console.log("SQL错误",err,sql);
            }
            callback(err,rows)
            connection.release()
        })
    })
}//对数据库进行增删改查操作的基础

exports.query = query