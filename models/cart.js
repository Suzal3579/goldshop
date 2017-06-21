module.exports = function cart(oldCart) {
    // oldCart might be undefined soo or is used ...
    this.items = oldCart.items || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQuantity++;
        this.totalPrice += storedItem.item.price;
    };

    this.generateArray = function () {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};