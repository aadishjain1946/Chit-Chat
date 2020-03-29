const bcrypt = require('bcryptjs');
const encryptOperations = {
    salt :13,
    encryptPassword(password){
       return  bcrypt.hashSync(password, this.salt);
    },
    compareHash(password,hashPwd){
       return bcrypt.compareSync(password, hashPwd);
    }
}
module.exports = encryptOperations;