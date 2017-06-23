var express = require('express');
var router = express.Router();
let productInstance = require("../models/product");
let cartInstance = require("../models/cart");

router.get('/', function (req, res, next) {
    productInstance.find((error, docs) => {
        let productChunk = [], chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Laxmi Ornaments', products: productChunk });
    });
});

router.get("/add-to-cart/:id", (req, res, next) => {
    let productId = req.params.id;
    let cart = new cartInstance(req.session.cart ? req.session.cart : {});
    productInstance.findById(productId, (err, product) => {
        if (err) {
            return res.redirect("/");
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/");
    });
});

router.get("/shopping-cart", (req, res, next) => {
    if (!req.session.cart) {
        return res.render("shop/shopping-cart", { products: null });
    }
    let cart = new cartInstance(req.session.cart);
    res.render("shop/shopping-cart", { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get("/checkout", (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    let cart = new cartInstance(req.session.cart);
    res.render("shop/checkout", { total: cart.totalPrice });
});

module.exports = router;