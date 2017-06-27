var express = require('express');
var router = express.Router();
let csrf = require("csurf");
let csrfProtect = csrf();
let passport = require("passport");

// below lines like router.use() will be applied to all routes ...
router.use(csrfProtect);

// this methods is here coz we dont want to apply isNotLoggedIn function to this single route ...
router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("user/profile");
});

router.get("/logout", (req, res, next) => {
    req.logout(); // method from passport ...
    res.redirect("/");
});


router.use("/", isNotLoggedIn, (req, res, next) => {
    next();
});

router.get("/signup", (req, res, next) => {
    let messages = req.flash("error");
    res.render("user/signup", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post("/signup", passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true
}), (req, res, next) => {
    if (res.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get("/signin", (req, res, next) => {
    let messages = req.flash("error");
    res.render("user/signin", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post("/signin", passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true
}), (req, res, next) => {
    if (res.session.oldUrl) {
        let oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});



module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // continue garrney ...
        return next();
    }
    // else send to homepage ...
    res.redirect("/");
}

function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        // continue garrney ...
        return next();
    }
    // else send to homepage ...
    res.redirect("/");
}