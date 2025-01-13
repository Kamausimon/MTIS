const mongoose = require("mongoose");


const suppliesSchema = new mongoose.Schema({
    supplierId: {
        type: mongoose.Schema.ObjectId,
        ref: "Supplier",
        required: [true, "Supply must have a supplier"]
    },
    products: [
        {
           Product_id:{
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [true, "Supply must have a product"]
           } ,
               quantity: {
            type: Number,
            required: [true, "Supply must have a quantity"]
        },
        price: {
            type: Number,
            required: [true, "Supply must have a price"]
        },
        }
    ],
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


suppliesSchema.pre('save', function (next) {
    if (!mongoose.Types.ObjectId.isValid(this.supplierId)) {
        return next(new Error('Invalid supplier ID'));
    }

    if (!Array.isArray(this.products)) {
        return next(new Error('Product IDs must be an array'));
    }

    const invalidProductIds = this.products.filter(
        (p) => !p || !mongoose.Types.ObjectId.isValid(p.Product_id)
    );

    console.log("invalidIds",invalidProductIds);
    if (invalidProductIds.length) {
        return next(new Error('Invalid product IDs in supply'));
    }

    next();
});



const Supplies = mongoose.model("Supplies", suppliesSchema);
module.exports = Supplies;