const passport = require('passport');
const path = require('path')
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
    const path = require('path');
    const userModel = require(path.join(__dirname, '../db/models/user'));
    const jwt = require("./jwt");
    userModel.findOne({ "userName": username }, (err, doc) => {
        if (err) {
            console.log(err);
            // throw err;
        }
        else {
            if (doc) {
                const encrypt = require(path.join(__dirname, 'encrypt'));
                if (encrypt.compareHash(password, doc.password)) {
                    var token = jwt.generateToken(doc.userId);
                    done(null, token);
                }
                else {
                    done(null, "password")
                }
            }
            else {
                done(null, "username")
            }
        }
    })
}
));

passport.serializeUser((user, done) => {
    // console.log("####1", user)
    done(null, user);
})
passport.deserializeUser((user, done) => {
    const jwt = require("./jwt");
    // console.log("####", user)
    if (jwt.verifyToken(user)) {
        done(null, user);
    }
})
module.exports = passport;