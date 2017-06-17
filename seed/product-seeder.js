var product = require("../models/product");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("localhost:27017/goldshop");

var products = [
    new product({
        imagePath: "http://7bna.net/images/gold-images/gold-images-10.jpg",
        title: "Pramesh",
        description: "Suzal",
        price: 12000
    }),
    new product({
        imagePath: "http://7bna.net/images/gold-images/gold-images-10.jpg",
        title: "Pramesh",
        description: "Suzal",
        price: 12000
    }),
    new product({
        imagePath: "http://7bna.net/images/gold-images/gold-images-10.jpg",
        title: "Pramesh",
        description: "Suzal",
        price: 12000
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function () {
        done += 1;
        if (done === products.length) {
            exit();
        }
    });
}
function exit() {
    mongoose.disconnect();
};
