const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact_name: { type: String },

    phone: { type: String },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    website: { type: String },

    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
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
