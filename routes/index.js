var express = require('express');
var router = express.Router();
let csrf = require("csurf");
let passport = require("passport");
/* GET home page. */
let productInstance = require("../models/product");
let csrfProtect = csrf();

router.use(csrfProtect);

router.get('/', function (req, res, next) {
    productInstance.find((error, docs) => {
        let productChunk = [], chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Laxmi Ornaments', products: productChunk });
    });
});

router.get("/user/signup", (req, res, next) => {
    let messages = req.flash("error");
    res.render("user/signup", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post("/user/signup", passport.authenticate("local.signup", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signup",
    failureFlash: true
}));

router.get("/user/profile", (req, res, next) => {
    res.render("user/profile");
});

router.get("/user/signin", (req, res, next) => {
    let messages = req.flash("error");
    res.render("user/signin", { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post("/user/signin", passport.authenticate("local.signin", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
    failureFlash: true
}));

module.exports = router;
