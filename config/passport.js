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
    req.checkBody("email", "Invalid E-mail.").notEmpty().isEmail();
    req.checkBody("password", "Invalid password.").notEmpty().isLength({ min: 4 });
    let errors = req.validationErrors();
    if (errors) {
        let mesg = [];
        errors.forEach((error) => {
            mesg.push(error.msg);
        });
        return done(null, false, req.flash("error", mesg));
    }
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

passport.use("local.signin", new localstat({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, (req, email, password, done) => {
    req.checkBody("email", "Invalid E-mail.").notEmpty().isEmail();
    req.checkBody("password", "Invalid password.").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach((err) => {
            messages.push(err.msg);
        });
        return done(null, false, req.flash("error", messages));
    }
    userModel.findOne({ "email": email }, (error, user) => {
        if (error) {
            return done(error);
        }
        if (!user) {
            return done(null, false, { message: "No user found." });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: "Passowrd wrong." });
        }
        return done(null, user);
    });
}));