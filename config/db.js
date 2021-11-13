var mysql = require('mysql')

var pool = mysql.createPool({
    host: '59.110.241.135',
    port: 3306,
    user: 'root',
    password: 'aliuyanfeng0125',
    database: 'vue3-blog'
});
pool.getConnection(function(err, connection) {
    if(err){
        console.log("建立连接失败");
    } else {
        console.log("建立连接成功");
        console.log(pool._allConnections.length); //  1
        // connection.query('select * from user', function(err, rows) {
        //     if(err) {
        //         console.log("查询失败");
        //     } else {
        //         console.log(rows);
        //     }
        //     // connection.destory();
        //     console.log(pool._allConnections.length);  // 0
        // })
    }
    pool.end();
})

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err, rows) {
            if (err) {
                return console.log("SQL错误");
            }
            callback(err,rows)
            connection.release()
        })
    })
}//对数据库进行增删改查操作的基础

exports.query = query