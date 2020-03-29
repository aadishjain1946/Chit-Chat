const passport = require('passport');
const path = require('path')
const googleoauth = require('passport-google-oauth2');
const no = require(path.join(__dirname,"imageid"))
passport.use(new googleoauth({
    callbackURL: 'https://mychit-chat.herokuapp.com/googleverify/verifygoogle.html',
    clientID: '243412518662-693jj38r6m7r55ugq0ls5djg8j8mpgm2.apps.googleusercontent.com',
    clientSecret: '7mKZF-WK65RPiLEWOuYnnUbW',
    passReqToCallback: true
},
    (request, accesstoken, refreshToken, profile, done) => {
        var u = profile.id;
        var uno = u.slice(0, 5);
        var userId = profile._json.given_name + uno;
        var uI = profile._json.given_name + no();
        var userObj = {
            'userId':uI,
            'userName': userId,
            'name': profile._json.name,
            'profilepic': profile._json.picture,
            'email': profile._json.email,
            'googleUser': true,
            'email_verified': true
        }
        const path = require('path');
        const userModel = require(path.join(__dirname, '../db/models/user'));
        const jwt = require("./jwt");
        userModel.findOne({ "email": userObj.email }, (err, doc) => {
            if (err) {
                throw err;
            }
            else {
                if (doc) {
                    var token = jwt.generateToken(doc.userId);
                    done(null, token);
                }
                else {
                    userModel.create(userObj, (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            var token = jwt.generateToken(userObj.userId);
                            done(null, token);
                            return true
                        }
                    })
                }
            }
        })
    }
));

passport.serializeUser((user, done) => {
    // console.log("####",user)
    done(null, user);
})
passport.deserializeUser((user, done) => {
    const jwt = require("./jwt");
    // console.log("####",user)
    if (jwt.verifyToken(user)) {
        done(null, user);
    }
})
module.exports = passport;