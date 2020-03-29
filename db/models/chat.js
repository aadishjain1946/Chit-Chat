const path = require('path');
const connection = require(path.join(__dirname, '../connection'));
const schema = connection.Schema;
const chatSchema = new schema({
    'chatId': { type: String, required: true, unique: true },
    'userId1': { type: String, required: true },
    'userId2': { type: String, required: true },
    'data': { type: Array },
})
const chatModel = connection.model('chats', chatSchema);
module.exports = chatModel;
