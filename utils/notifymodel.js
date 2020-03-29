class notify {
    constructor(friendreq = false, msg, reqUser,pic,uname,categ) {
        this.friendreq = friendreq;
        this.msg = msg;
        this.categ = categ;
        this.pic = pic;
        this.uname = uname;
        this.reqUser = reqUser;
    }
}
module.exports = notify;