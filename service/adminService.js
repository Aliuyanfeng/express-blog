// 后台管理接口行为类 接受参数 处理业务 执行sql 查询数据并返回结果
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
		}, ((error) => {
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
			let insertArticle =
				`INSERT INTO blog_article_list (article_title,article_description,article_createtime,article_like,article_read,article_tag,article_cover,article_status,article_content,article_comment,article_author,article_importance) 
                                VALUES ('${data.title}','${data.content_short}','${data.display_time}',0,0,'${deal_article_tag}','${data.image_uri}','${data.status}','${deal_article_content}','${deal_article_comment}','${data.author}','${data.importance}')
                                `
			db.query(insertArticle, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then((data) => {
			return data
		}, ((error) => {
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
					result[0].article_content = Buffer.from(str, "base64").toString();
					resolve(result)
				} else {
					resolve(result)
				}

			})
		}).then((data) => {
			return data
		}, ((error) => {
			return error
		}))
	};
	// 更新指定文章
	async updateArticle(form) {
		let deal_platforms = form.platforms.join(',')
		let deal_article_comment = form.comment_disabled ? 1 : 0
		let deal_article_content = Buffer.from(form.content).toString('base64')

		return await new Promise((resolve, reject) => {
			let updateArticleSql =
				`update blog_article_list set 
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

			db.query(deleteArticleSql, (err, result) => {
				if (err) {
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

			db.query(addNoteCategorySql, (err, result) => {
				if (err) {
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
			let getNoteCategorySql = `select * from blog_note_classify`

			db.query(getNoteCategorySql, (err, result) => {
				if (err) {
					reject(err)
				}
				resolve(result)
			})
		}).then(data => {

			let tempData = []; //处理后的数据

			let firstData = []; //一级分类
			let secondData = []; //二级/三级分类

			data.map(item => {
				if (item.pid == 0) {
					firstData.push(item)
					let tempObj = {
						id: item.id,
						name: item.classify_name,
						children: []
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
							children: []
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

			db.query(editNoteCategorySql, (err, result) => {
				if (err) {
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
			let delNoteCaegorySql = `delete from blog_note_classify where id = ${form.id}`

			db.query(delNoteCaegorySql, (err, result) => {
				if (err) {
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
			let deal_md = Buffer.from(form.md).toString('base64')
			let deal_html = Buffer.from(form.html).toString('base64')
			let publishNoteSql =
				`INSERT INTO blog_note_list (note_name,note_md,note_html,note_classify_id) 
                                VALUES ('${form.name}','${deal_md}','${deal_html}','${form.parent_id}')
                                `
			db.query(publishNoteSql, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then((data) => {
			return data
		}, ((error) => {
			return error
		}))
	};
	// 更新基本信息
	async updateBaseInfo(form) {
		return new Promise(async (resolve,reject)=>{
			let update_result = await db.update('blog_baseInfo',form)
			if(update_result){
				resolve(update_result)
			}else{
				reject('update is Error')
			}
		})
	};
	// 发布题目
	async addQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deal_answer = Buffer.from(form.question_answer).toString('base64')
			let deal_stem = Buffer.from(form.question_stem).toString('base64')
			let addQuestionSql =
				`INSERT INTO blog_question_list (question_type,question_stem,question_answer,question_classify) 
                                VALUES ('${form.question_type}','${deal_stem}','${deal_answer}','${form.question_classify}')
                                `
			db.query(addQuestionSql, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then(data => {
			return data
		}).catch(error => {
			return error
		})
	};
	//获取所有题目
	async getAllQuestion(form) {
		return await new Promise(async (resolve, reject) => {

			var npagesize = (form.page - 1) * 10

			const getAllQuestionSql = `select * from blog_question_list limit ${npagesize},${form.limit}`

			const getAllQuestionTotalSql = `select count(*) as total from blog_question_list`

			var questionTotal;


			await db.query(getAllQuestionTotalSql, (err, result) => {
				if (err) {
					return next(err)
				}
				questionTotal = result[0].total
			})

			await db.query(getAllQuestionSql, (err, result) => {
				if (err) {
					reject(err)
				}

				// switch base64 to string Buffer.from(result[0].question_stem, "base64").toString();
				result = result.map((item, index) => {
					item.question_stem = Buffer.from(item.question_stem, "base64").toString()
					item.question_answer = Buffer.from(item.question_answer, "base64").toString()
					return item
				})
				resolve({
					result,
					questionTotal
				})

			})
		}).then(data => {
			return data
		}, error => {
			return error
		})
	};

	//删除指定题目
	async deleteQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deleteQuestionSql = `delete from blog_question_list where id = ${form.id}`

			db.query(deleteQuestionSql, (err, result) => {
				if (err) {
					reject(err)
				}
				resolve(result)
			})
		}).then(data => {
			if (data.affectedRows == 0) {
				return 0
			} else {
				return 1
			}

		}, error => {
			return error
		})
	};

	//更新题目
	async updateQuestion(form) {
		return await new Promise((resolve, reject) => {
			let deal_answer = Buffer.from(form.question_answer).toString('base64')
			let deal_stem = Buffer.from(form.question_stem).toString('base64')
			let updateQuestionSql =
				`update blog_question_list set 
                            question_type = "${form.question_type}",
                            question_stem = "${deal_stem}",
                            question_answer = "${deal_answer}",
                            question_classify = "${form.question_classify}"
                            where id = ${form.id}`
			db.query(updateQuestionSql, (err, result) => {
				if (err) {
					return next(err)
				}
				resolve(result)
			})
		}).then(data => {
			return data
		}).catch(error => {
			return error
		})
	};

	//获取指定题目
	async getQuestionDetail(form) {
		return await new Promise((resolve, reject) => {
			let getQuestionDetailSql = `select * from blog_question_list where id = ${form.id}`
			db.query(getQuestionDetailSql, (err, result) => {
				if (err) {
					return next(err)
				}
				result[0].question_stem = Buffer.from(result[0].question_stem, "base64").toString();
				result[0].question_answer = Buffer.from(result[0].question_answer, "base64").toString();
				resolve(result)
			})
		}).then(data => {
			return data
		}, (err => {
			return err
		}))
	};
	
	//更新文章/题库分类
	updateCategory(form){
		return new Promise(async (resolve,reject)=>{
			let update_result = await db.update('blog_article_classify',form)
			if(update_result){
				resolve(update_result)
			}else{
				reject('update is Error')
			}
		})
	};
	
	//删除文章/题库分类
	deleteCategory(form){
		return new Promise(async (resolve,reject)=>{
			let delete_result = await db.delete('blog_article_classify',form.id)
			console.log(delete_result)
			if(delete_result){
				resolve(delete_result)
			}else{
				reject('delete classify is failed')
			}
		})
	};
	
	//创建文章/题库分类
	async createCategory(form){
		return new Promise(async (resolve, reject) => {
			let create_result = await db.insert('blog_article_classify',form)
			console.log(create_result)
			if(create_result){
				resolve(create_result)
			}else{
				reject('create classify is failed')
			}
		})
	}

	// 更新banner
	async upDateBanner(form) {
		return new Promise(async (resolve,reject)=>{
			let update_result = await db.update('blog_baseInfo',form)
			if(update_result){
				resolve(update_result)
			}else{
				reject('update is Error')
			}
		})
	}


	// 获取分析首页数据
	getAnalysisIndex(form) {
		return new Promise(async (resolve, reject) => {
			let visitorTotalResult = await db.findBySql(`select count(*) as total from blog_visitors_record where create_time BETWEEN CONCAT(CURDATE(),' 00:00:00') AND CONCAT(CURDATE(),' 23:59:59');
			`).catch(err => {
				reject(err)
			})

			let likeTotalResult = await db.findBySql(`select count(*) as total from blog_like_record where create_time BETWEEN CONCAT(CURDATE(),' 00:00:00') AND CONCAT(CURDATE(),' 23:59:59');
			`).catch(err => {
				reject(err)
			})

			// let visitorWeekResult = await db.findBySql(`select * from blog_visitors_record where DATE_SUB(CURDATE(),INTERVAL 7 DAY) < DATE(create_time);`).catch(err => {
			// 	reject(err)
			// })

			let days = [];
			// var Date = new Date();
			for(let i=0; i<=24*6;i+=24){		//今天加上前6天
				let dateItem = new Date(new Date().getTime() - i * 60 * 60 * 1000);	//使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
				let y = dateItem.getFullYear();	//获取年份
				let m = dateItem.getMonth() + 1;	//获取月份js月份从0开始，需要+1
				let d= dateItem.getDate();	//获取日期
				m = m.toString().length == 1 ? m = '0' + m.toString() : m;
				d = d.toString().length == 1 ? d = '0' + d.toString() : d;
				let valueItem= y + '-' + m + '-' + d;	//组合
				days.unshift(valueItem);	//添加至数组
			}
			console.log(days)
			// 使用async await 处理异步操作
			let visitorWeekResult = await Promise.all(days.map(async (item) => {
				// 等待异步操作完成，返回执行结果
				let findResult =  await db.findBySql(`select count(*) as total from blog_visitors_record where create_time BETWEEN CONCAT('${item}',' 00:00:00') AND CONCAT('${item}',' 23:59:59');
				`).catch(err => {
					reject(err)
				})
				return findResult[0].total
			}));
			let likeWeekResult = await Promise.all(days.map(async (item) => {
				// 等待异步操作完成，返回执行结果
				let findResult =  await db.findBySql(`select count(*) as total from blog_like_record where create_time BETWEEN CONCAT('${item}',' 00:00:00') AND CONCAT('${item}',' 23:59:59');
				`).catch(err => {
					reject(err)
				})
				return findResult[0].total
			}));

			
			resolve({
				visitorsTotal: visitorTotalResult[0].total,
				likeTotal: likeTotalResult[0].total,
				daysWithSeven:days,
				visitorWeekResult: visitorWeekResult,
				likeWeekResult: likeWeekResult
			})
			
		})
	}
}

module.exports = AdminService
