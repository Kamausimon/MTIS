const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "STOCK_ADJUSTMENT"],
    }, //action perfomed ie create, update, delete
    entity: {
      type: String,
      required: true,
      enum: ["PRODUCT", "ORDER", "USER", "CATEGORY", "SUPPLIER"],
    }, //entity affected ie user, product, order
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entity",
      required: true,
    }, //id of entity affected

    perfomedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, //user who performed the action
    changes: {
      type: Object,
      required: true,
    },
    user_role: { type: String, required: true }, //role of user who performed the action
    businessCode: {
      type: String,
      required: true,
      ref: "Business",
    }, //tenant of user who performed the action
    
},
  { timestamps: true }
);

const Audit = mongoose.model("Audit", auditSchema);
module.exports = Audit;
