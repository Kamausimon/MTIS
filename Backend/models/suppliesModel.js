const mongoose = require("mongoose");


const suppliesSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: "Suppliers",
        required: [true, "Supply must have a supplier"]
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
        required: [true, "Supply must have a product"]
    },
    quantity: {
        type: Number,
        required: [true, "Supply must have a quantity"]
    },
    price: {
        type: Number,
        required: [true, "Supply must have a price"]
    }
}, {
    timestamps: true
});

const Supplies = mongoose.model("Supplies", suppliesSchema);
module.exports = Supplies;