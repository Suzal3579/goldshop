var express = require('express');
var router = express.Router();
let productInstance = require("../models/product");

router.get('/', function (req, res, next) {
    productInstance.find((error, docs) => {
        let productChunk = [], chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productChunk.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Laxmi Ornaments', products: productChunk });
    });
});

module.exports = router;
