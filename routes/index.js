var express = require('express');
var router = express.Router();
let productInstance = require("../models/product");
let cartInstance = require("../models/cart");

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
    let errorMsg = req.flash("error")[0];
    res.render("shop/checkout", { total: cart.totalPrice, errorMsg: errorMsg, noError: !errorMsg });
});

router.post("/checkout", (req, res, next) => {
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
        req.flash("success", "Successfuly done");
        req.session.cart = null;
        res.redirect("/");
    });
});

module.exports = router;