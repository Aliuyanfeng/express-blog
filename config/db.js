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
				// connection.release()
                console.log("SQL错误","错误信息：" + err.sqlMessage,"SQL语句：" + sql);
            }
            callback(err,rows)
            connection.release()
        })
    })
}//对数据库进行增删改查操作的基础


//封装Promise查询 传入sql
exports.findBySql = function (sql) {
	return new Promise((resolve,reject)=>{
		query(sql,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result)
		})
	})
}
//通用查找总数
exports.findTotal = function (tableName){
	let findTotalSql = `select count(1) as total from ${tableName}`;
	return new Promise((resolve,reject)=>{
		query(findTotalSql,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result[0])
		})
	})
}

// 通用find
exports.find = function(tableName){
	let findSql = `select * from ${tableName}`
	return new Promise((resolve,reject)=>{
		query(findSql,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result)
		})
	})
}

// 通用删除
exports.delete = function(tableName,id){
	let deleteSql = `delete from ${tableName} where id = ${id}`
	return new Promise((resolve,reject)=>{
		query(deleteSql,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result)
		})
	})
}

// 通用更新
exports.update = function(tableName,form){
	
	let updateJoinStr = ``;
	
	Object.keys(form).forEach(function(key){
		if(key != 'id'){
			updateJoinStr += `${key}='${form[key]}',`
		}
	});
	
	if (updateJoinStr.length > 0) {
		 updateJoinStr = updateJoinStr.substring(0, updateJoinStr.length - 1);
	 }
	
	let updateSql = `update ${tableName} set ${updateJoinStr} where id = ${form.id} `
	
	return new Promise((resolve,reject)=>{
		query(updateSql,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result)
		})
	})
}

//通用新增
exports.insert = function (tableName, form) {
	let insertJoinStr = ``;
	let	insertJoinStr2 = ``;
	
	for (const key in form) {
		if (key != 'id') {
			insertJoinStr += `${key},`
			insertJoinStr2 += `'${form[key]}',`
		}
	}

	if (insertJoinStr.length > 0 && insertJoinStr2.length > 0) {
		insertJoinStr = insertJoinStr.substring(0, insertJoinStr.length - 1);
		insertJoinStr2 = insertJoinStr2.substring(0, insertJoinStr2.length - 1);
	}

	let insertsQL = `INSERT INTO ${tableName} (${insertJoinStr}) VALUES (${insertJoinStr2})`

	return new Promise((resolve,reject)=>{
		query(insertsQL,(err,result)=>{
			if(err){
				reject(err)
			}
			resolve(result)
		})
	})
}
exports.query = query