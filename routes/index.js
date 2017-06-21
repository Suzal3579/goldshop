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

module.exports = router;