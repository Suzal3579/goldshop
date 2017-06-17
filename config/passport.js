let passport = require("passport");
let userModel = require("../models/user");
let localstat = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (error, user) => {
        done(error, done);
    });
});

passport.use("local.signup", new localstat({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    userModel.findOne({ "email": email }, (error, user) => {
        if (error) {
            return done(error);
        }
        if (user) {
            return done(null, false, { message: "E-mail already in use. Please try another one." });
        }
        var newUser = new userModel();
        newUser.email = email;
        newUser.password = newUser.encryptPass(password);
        newUser.save((error, result) => {
            if (error) {
                return done(error);
            }
            return done(null, newUser);
        });
    });
}));