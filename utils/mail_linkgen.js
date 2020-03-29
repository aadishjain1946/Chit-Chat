function gen(userid){
    var a = 'https://chit-chat-server-service.herokuapp.com/user/verifymail?id='+userid;
    return a;
}
module.exports = gen;