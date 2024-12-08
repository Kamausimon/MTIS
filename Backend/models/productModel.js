const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "A product must belong to a category"],
    },
    businessCode: {
      type: String,
      required: true,
      ref: "Business",
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

productSchema.virtual("stockStatus").get(function () {
  return this.stock <= this.low_stock_threshold ? "low" : "normal";
});

productSchema.methods.isLowStock = function () {
  return this.stock <= this.low_stock_threshold;
};

module.exports = mongoose.model("Product", productSchema);
