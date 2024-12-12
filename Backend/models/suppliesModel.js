const mongoose = require("mongoose");


const suppliesSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.ObjectId,
        ref: "Supplier",
        required: [true, "Supply must have a supplier"]
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "Supply must have a product"]
    },
    quantity: {
        type: Number,
        required: [true, "Supply must have a quantity"]
    },
    price: {
        type: Number,
        required: [true, "Supply must have a price"]
    },
    date: {
        type: Date,
        default: Date.now()
    },
    businessCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

suppliesSchema.index({ supplierId: 1, productId: 1 });

suppliesSchema.pre('save', async function (next) {
    if(!mongoose.Types.ObjectId.isValid(this.supplierId) || !mongoose.Types.ObjectId.isValid(this.productId)) {
        next(new Error('Invalid supplier or product ID'));
    }
});

const Supplies = mongoose.model("Supplies", suppliesSchema);
module.exports = Supplies;