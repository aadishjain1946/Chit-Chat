const jwt = require('jsonwebtoken');
const tokenOperations = {
    SECRETKEY: '2*F!U@C)Kthi1is()my#@chit^&chat',
    generateToken(userid) {
        var token = jwt.sign({ userid }, this.SECRETKEY, { expiresIn: '24h' });
        // console.log("!!!!!!!!!!",token)
        return token;
    },
    verifyToken(clientTokenNumber) {
        var flag = -1;
        var userid = "";
        jwt.verify(clientTokenNumber, this.SECRETKEY, (err, decoded) => {
            if (!err) {
                flag = 10;
                userid = decoded.userid;
            }
            else {
                flag = -1;
            }
        });
        if(flag>0){
        return userid
        }
        else{
            return false;
        }
    }

}
module.exports = tokenOperations;
