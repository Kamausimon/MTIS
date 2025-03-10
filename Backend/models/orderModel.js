const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_number: { type: String, required: true, unique: true },
    order_date: { type: Date, required: true },
    order_status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },

    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_address: { type: String },

    items: [
      {
        Product_id: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        product_name: { type: String},
        price: { type: Number, required: true },
        item_subtotal: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    total: { type: Number, required: true },

    businessCode: {
      type: String,
      required: true,
      ref: "Business",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
