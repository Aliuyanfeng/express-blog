const multer = require('multer');
const path = require('path')
module.exports = {
    baseStorage: multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../../upload/images/base")) //服务器目录
            // cb(null,'./uploads')
        },
        //修改文件名称
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, 'blog_base_' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    }),
    normalStorage: multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, "../../upload/images/normal")) //服务器目录
            // cb(null,'./uploads')
        },
        //修改文件名称
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, 'blog_normal_' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    }),
    imageFilter: function (req, file, cb) {
        console.log(file)
        var acceptableMime = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
        //微信公众号只接收上述四种类型的图片
        if (acceptableMime.indexOf(file.mimetype) !== -1) {
            cb(null, true)
        } else {
            cb(new Error('Only jpeg or png images allowed'))
            cb(null, false)
        }
    },
    imageLimit: {
        fieldSize: 5 * 1024 * 1024,
        fileSize: 5 * 1024 * 1024
    }
}