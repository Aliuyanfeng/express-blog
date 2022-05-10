var db = require('../config/db')

module.exports = {
	// 获取指定分类下的笔记
	getNote(form) {
		return new Promise((resolve, reject) => {
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
	},

	// 获取笔记所有分类
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
	},


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
	},

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

			// let tempData = []; //处理后的数据

			// let firstData = []; //一级分类
			// let secondData = []; //二级/三级分类

			function arrayToTree(arr) {
			let tree = []
				const map = {}
				for (let item of arr) {
					// 一个新的带children的结构
					map[item.id] = {
						...item,
						children: []
					}
					
				}
				// console.log(map)
				for (let item of arr) {
					let newItem = map[item.id]
					if (map[item.pid]) { // 父节点已存进map则在父节点的children添加新元素
						let parent = map[item.pid]
						parent.children.push(newItem)
					} else { // 没有父节点，在根节点添加父节点
						tree.push(newItem)
					}
					// console.log(tree)
				}
				return tree
			}
			
			// data.map(item => {
			// 	if (item.pid == 0) {
			// 		firstData.push(item)
			// 		let tempObj = {
			// 			id: item.id,
			// 			name: item.classify_name,
			// 			children: []
			// 		}
			// 		tempData.push(tempObj)
			// 	} else {
			// 		secondData.push(item)
			// 	}
			// })

			// secondData.map(item => {
			// 	tempData.map(item2 => {
			// 		if (item.pid == item2.id) {
			// 			let tempObj = {
			// 				id: item.id,
			// 				name: item.classify_name,
			// 				children: []
			// 			}
			// 			item2.children.push(tempObj)
			// 		}
			// 	})
			// })

			// tempData.map(item => {
			// 	item.children.map(item2 => {
			// 		secondData.map(item3 => {
			// 			if (item2.id == item3.pid) {
			// 				let tempObj = {
			// 					id: item3.id,
			// 					name: item3.classify_name,
			// 				}
			// 				item2.children.push(tempObj)
			// 			}
			// 		})
			// 	})
			// })


			// return tempData
			return arrayToTree(data)
		}, error => {
			return error
		})
	}
}