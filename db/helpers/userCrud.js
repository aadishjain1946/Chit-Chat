const path = require('path');
const userModel = require(path.join(__dirname, '../models/user'));
const encrypt = require(path.join(__dirname, '../../utils/encrypt'));
const useroperations = {
    newUserAdd(userObj, res) {
        userObj.password = encrypt.encryptPassword(userObj.password);
        userModel.create(userObj, (err) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                res.status(200).send({ status: 200, message: 'Record Added' });
            }
        })
    },
    emailCheck(userObj, res) {
        userModel.find({ "email": userObj.email }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (docs.length != 0) {

                    res.status(200).send({ status: 200, found: true });
                }
                else {
                    res.status(200).send({ status: 200, found: false });
                }
            }
        })
    },
    userIdCheck(userObj, res) {
        userModel.find({ "userId": userObj.userId }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Error' });
            }
            else {
                if (docs.length != 0) {
                    res.status(200).send({ status: 200, found: true });
                }
                else {
                    res.status(200).send({ status: 200, found: false });
                }
            }
        })
    },
    mailVerify(userid, res) {
        userModel.update({ "userId": userid }, { $set: { 'email_verified': true } }, (err) => {
            if (err) {
                res.status(500).send("Error Occur please try again");
            }
            else {
                res.status(200).send("Congrulations your email is verified");
            }
        })
    },
    Email_verify(obj, res) {
        userModel.find({ "email": obj.email, "email_verified": true }, (err, doc) => {
            if (err) {
                res.status(500);
            }
            else {
                if (doc.length == 0) {
                    res.status(200).send({ verify: false });
                }
                else {
                    res.status(200).send({ verify: true });
                }
            }
        })
    },
    fetchData(userId, res) {
        userModel.find({ "userId": userId }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record Not Added Due to Error' });
            }
            else {
                if (doc.length != 0) {
                    doc = doc[0];
                    res.status(200).send({ data: doc });
                }
                else {
                    res.status(200).send({ data: false });
                }
            }
        })
    },
    searchuser(username, res) {
        userModel.find({ userName: { '$regex': '^' + username, '$options': 'i' } }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record cannot be found ' });
            }
            else {
                if (docs.length != 0) {
                    res.status(200).send({ data: docs });
                }
                else {
                    res.status(200).send({ data: false });
                }
            }
        })
    },
    fetchnotifydata(username, res) {
        userModel.findOne({ userId: username }, (err, doc) => {
            var notify = doc.notifications;
            if (err) {
                res.status(500).send({ status: 500, message: 'Record cannot be found ' });
            }
            else {
                if (notify.length != 0) {
                    noti = [];
                    for (i = notify.length - 1; i >= 0; i--) {
                        noti.push(notify[i]);
                    }
                    res.status(200).send({ notify: noti });
                }
                else {
                    res.status(200).send({ notify: false });
                }
            }
        })
    },
    delnotifydata(data, userid, res) {
        userModel.update({ userId: userid }, { "$pull": { "notifications": data } }, (err, doc) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record cannot be found ' });
            }
            else {
                res.status(200).send({ notify: true });
            }
        })
    },
    fetchUSer(user, res) {
        userModel.find({ userId: user }, (err, docs) => {
            if (err) {
                res.status(500).send({ status: 500, message: 'Record cannot be found ' });
            }
            else {
                if (docs.length != 0) {
                    res.status(200).send({ data: docs });
                }
                else {
                    res.status(200).send({ data: false });
                }
            }
        })
    },
    addfriendnotify(data, userid) {
        userModel.update({ userId: userid }, { "$push": { "follower": data.reqUser } }, (err) => {
            if (err) {
                throw err;
            }
        })
        userModel.update({ userId: data.reqUser }, { "$push": { "following": userid } }, (err) => {
            if (err) {
                throw err;
            }
        })
    },
    async searchuserfnoti(username) {
        var data = await userModel.findOne({ userId: username })
        return data;
    },
    async notifyadd(userid, data) {
        return await userModel.update({ "userId": userid }, { $push: { notifications: data } })
    }
}
module.exports = useroperations;