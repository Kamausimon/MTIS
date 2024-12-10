const mongoose = require('mongoose');   

const invoiceSchema = new mongoose.Schema({
    invoice_number : {type: String, required: true, unique: true},
    order_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
    customer_name : {type: String, required: true},
    customer_email : {type: String, required: true},
    items: [
        {
            product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true},
            price: {type: Number, required: true},
            subtotal: {type: Number, }
        }
    ],
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    tax: {type: Number},
    shipping_cost: {type: Number},
    businessCode: {type: String, required: true},
    payment_status: {type: String, enum: ['paid', 'pending'], default: 'pending'},

}, {timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;