var express = require('express');
var router = express.Router();
let productInstance = require("../models/product");
let cartInstance = require("../models/cart");
let orderInstance = require("../models/order");

router.get('/', function (req, res, next) {
    let successMsg = req.flash("success")[0];
    productInstance.find((error, docs) => {
        let productChunk = [], chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {
            title: 'Laxmi Ornaments',
            products: productChunk,
            successMsg: successMsg,
            noMessage: !successMsg
        });
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

router.get("/checkout", isLoggedIn, (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    let cart = new cartInstance(req.session.cart);
    let errorMsg = req.flash("error")[0];
    res.render("shop/checkout", { total: cart.totalPrice, errorMsg: errorMsg, noError: !errorMsg });
});

router.post("/checkout", isLoggedIn, (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    let cart = new cartInstance(req.session.cart);
    var stripe = require("stripe")(
        "sk_test_UNbrtw70JLU5nVhHpIApD1tO"
    );

    stripe.charges.create({
        amount: Math.ceil(cart.totalPrice / 103),
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge"
    }, function (err, charge) {
        // asynchronously called ...
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }
        let order = new orderInstance({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save((error, result) => {
            req.flash("success", "Successfuly done");
            req.session.cart = null;
            res.redirect("/");
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // continue garrney ...
        return next();
    }
    res.session.oldUrl = req.url;
    // else send to signin page ...
    res.redirect("/user/signin");
}