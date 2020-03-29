const path = require('path');
const connection = require(path.join(__dirname, '../connection'));
const schema = connection.Schema;
const uploadSchema = new schema({
    'imgId': { type: String, required: true },
    'userId': { type: String, required: true },
    'date': { type: String, required: true },
    'file': { type: String, required: true },
    'likes': { type: Array }
})
const uploadModel = connection.model('uploads', uploadSchema);
module.exports = uploadModel;
