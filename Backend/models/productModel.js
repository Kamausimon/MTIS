const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A product must belong to a category"],
    },
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    low_stock_threshold: { type: Number, default: 5 },

    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive"],
    },
    image_url: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
