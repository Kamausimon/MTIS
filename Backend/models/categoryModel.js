const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    children: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    level: { type: Number, default: 0 },
    businessCode: {
      type: String,
      required: true,
      ref: "Business",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema); // Category is the name of the model, categorySchema is the schema
