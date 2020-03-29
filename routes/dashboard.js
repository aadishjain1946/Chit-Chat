const express = require('express');
const path = require('path')
const userCrud = require(path.join(__dirname, '../db/helpers/userCrud'));
const chatCrud = require(path.join(__dirname, '../db/helpers/chatCrud'));
const jwt = require(path.join(__dirname, '../utils/jwt'));
var upload = require(path.join(__dirname, '../utils/multer'));
const dashboardRoutes = express.Router();
dashboardRoutes.get('/initial', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    userCrud.fetchData(userId, res);
})
dashboardRoutes.post('/uploadimg', upload.single('file'), (req, res) => {
    var today = new Date();
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'Pm' : 'Am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    var time = formatAMPM(today);
    var dateTime = date + ' ' + time;

    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var obj = {
        userId: userId,
        date: dateTime,
        file: req.file.filename,
        imgId: req.file.filename.split('.')[0]
    }
    const uploadcrud = require(path.join(__dirname, "../db/helpers/uploadCrud"));
    uploadcrud.uploadData(obj, res);
})
dashboardRoutes.get('/searchUser', (req, res) => {
    data = req.query.name;
    userCrud.searchuser(data, res);
    // console.log(data)
})
dashboardRoutes.get('/fetchnotifydata', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    userCrud.fetchnotifydata(userId, res);
})
dashboardRoutes.post('/fetchUSer', (req, res) => {
    data = req.body;
    userCrud.fetchUSer(data.data, res);
})
dashboardRoutes.post('/firenotify', (req, res) => {
    data = req.body;
    const notifymodel = require(path.join(__dirname, "../utils/notifymodel"));
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    var userData = userCrud.searchuserfnoti(userId);
    userData.then(data1 => {
        model = new notifymodel(true, data.msg, userId, data1.profilepic, data1.userName);
        ntdata = userCrud.notifyadd(data.req, model);
        ntdata.then(data => {
            if (data) {
                res.status(200).send("notification send");
            }
            else {
                res.status(500).send("Error Occur please try again");
            }
        })
    })
})
dashboardRoutes.post('/delnotifydata', (req, res) => {
    data = req.body.data;
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    userCrud.delnotifydata(data, userId, res);
})
dashboardRoutes.post('/addfriendnotify', (req, res) => {
    data = req.body.data;
    var token = req.headers['x-csrf-token'];
    const notifymodel = require(path.join(__dirname, "../utils/notifymodel"));
    userId = jwt.verifyToken(token);
    var userData = userCrud.searchuserfnoti(userId);
    userData.then(data1 => {
        msg = "You started following"
        model = new notifymodel(false, msg, userId, data1.profilepic, data1.userName, "following");
        ntdata = userCrud.notifyadd(data.reqUser, model);
        ntdata.then(data => {
            if (!data) {
                console.log("err")
            }
        })
    })
    var userData = userCrud.searchuserfnoti(data.reqUser);
    userData.then(data1 => {
        msg = "started following you."
        model = new notifymodel(false, msg, userId, data1.profilepic, data1.userName, "follower");
        ntdata = userCrud.notifyadd(userId, model);
        ntdata.then(data => {
            if (data) {
                res.status(200).send("notification send");
            }
            else {
                res.status(500).send("Error Occur please try again");
            }
        })
    })
    userCrud.addfriendnotify(data, userId, res);
})
dashboardRoutes.get('/fetchPost', (req, res) => {
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    const uploadcrud = require(path.join(__dirname, "../db/helpers/uploadCrud"));
    var userData = userCrud.searchuserfnoti(userId);
    userData.then(data1 => {
        dta = data1.following;
        uploadcrud.fetchPost(dta, res);
    })
})
dashboardRoutes.post('/chatitni', (req, res) => {
    data = req.body;
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    // console.log(data)
    chatCrud.newChat(data, res);
})
dashboardRoutes.post('/fetchchatuser', (req, res) => {
    data = req.body.data;
    var token = req.headers['x-csrf-token'];
    userId = jwt.verifyToken(token);
    chatCrud.searchChatuser(data, res);
})
dashboardRoutes.post('/liked', (req, res) => {
    data = req.body.data;
    const uploadcrud = require(path.join(__dirname, "../db/helpers/uploadCrud"));
    uploadcrud.liked(data, res);
})
dashboardRoutes.post('/disliked', (req, res) => {
    data = req.body.data;
    const uploadcrud = require(path.join(__dirname, "../db/helpers/uploadCrud"));
    uploadcrud.disliked(data, res);
})
module.exports = dashboardRoutes;