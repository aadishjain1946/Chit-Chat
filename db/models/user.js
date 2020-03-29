const path = require('path');
const connection = require(path.join(__dirname, '../connection'));
const schema = connection.Schema;
const userSchema = new schema({
    'name': { type: String, required: true },
    'userName': { type: String, required: true, unique: true },
    'userId': { type: String, required: true, unique: true },
    'password': { type: String, default: "abcd" },
    'email': { type: String, required: true, unique: true },
    'profilepic': { type: String, default: "https://chit-chat-server-service.herokuapp.com/male_user.png" },
    'bio': { type: String, default: "" },
    'follower': { type: Array },
    'following': { type: Array },
    'email_verified': { type: Boolean, default: false },
    'googleUser': { type: Boolean, default: false },
    'notifications': { type: Array }
})
const userModel = connection.model('users', userSchema);
module.exports = userModel;
