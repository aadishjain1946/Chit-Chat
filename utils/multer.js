const multer = require('multer');
const path = require("path");
const fullPath = path.join(__dirname, "../", "public");
// var upload = multer({ dest: fullPath })
const no = require('./imageid');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fullPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + no()+ path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage });

module.exports = upload;
