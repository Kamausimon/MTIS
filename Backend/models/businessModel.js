const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, unique: true },
    businessType: { type: String, required: true },
    businessCode: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isConfirmed: { type: Boolean, default: false },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

businessSchema.pre("save", function (next) {
  if (!this.businessCode) {
    this.businessCode = `BUS${Date.now().toString().slice(-6)}${Math.random()
      .toString(36)
      .slice(-4)}`.toUpperCase();
  }
  console.log("Business code: ", this.businessCode);
  next();
});

module.exports = mongoose.model("Business", businessSchema);
