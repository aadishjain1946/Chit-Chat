const path = require('path')
const express = require('express');
const passport = require('../utils/googlelogin');
const passport1 = require('../utils/passport');
const userRoutes = express.Router();
const userCrud = require(path.join(__dirname, '../db/helpers/userCrud'));
const no = require(path.join(__dirname, "../utils/imageid"));
userRoutes.post("/register", (req, res) => {
    var obj = req.body;
    obj.userId = obj.userName + no();
    userCrud.newUserAdd(obj, res);
    const mail = require(path.join(__dirname, '../utils/mail'));
    var link = require(path.join(__dirname, '../utils/mail_linkgen'))(req.body.userId);
    const mail_const = require(path.join(__dirname, '../utils/mailconf'))(req.body.name, link);
    mail(mail_const.su, mail_const.m, req.body.email, res)
})
userRoutes.post("/mailcheck", (req, res) => {
    userCrud.emailCheck(req.body, res);
})
userRoutes.post("/userIDcheck", (req, res) => {
    userCrud.userIdCheck(req.body, res);
})
userRoutes.get("/verifymail", (req, res) => {
    userCrud.mailVerify(req.query.id, res);
})
userRoutes.post("/Email_verify", (req, res) => {
    userCrud.Email_verify(req.body, res);
})
userRoutes.get("/googleauth", passport.authenticate('google', { scope: ['profile', 'email'] }));
userRoutes.post("/localauth", passport1.authenticate('local'), (req, res) => {
    if (req.user == "password") {
        res.send({ msg: "Incorrect Password", token: false });
    }
    else if (req.user == "username") {
        res.send({ msg: "Username Not found", token: false });
    }
    else {
        res.send({ token: req.user });
    }
});
userRoutes.get("/authgoogle", passport.authenticate('google'), (req, res) => {
    res.send({ token: req.user });
});
module.exports = userRoutes;