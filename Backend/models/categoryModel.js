const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  children: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  level: { type: Number, default: 0 },
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

Module.exports = mongoose.model("Category", categorySchema); // Category is the name of the model, categorySchema is the schema
