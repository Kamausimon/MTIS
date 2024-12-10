const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact_name: { type: String },

    phone: { type: String },
    email: { type: String , required: true},
    address: { type: String },
    city: { type: String },
    website: { type: String },

    products: [
      {
        Product_id: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        }}
    ],
    businessCode: {
      type: String,
      required: true,
      ref: "Business",
    },

    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive"],
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supplier", supplierSchema);
