var express = require('express');
var router = express.Router();
let productInstance = require("../models/product");
let csrf = require("csurf");
/* GET home page. */
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
    res.render("user/signup", { csrfToken: req.csrfToken() });
});

router.post("/user/signup", passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
}));
module.exports = router;
