const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    tenant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    permissions: [{ type: String }],

    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema); // User is the name of the model, userSchema is the schema
