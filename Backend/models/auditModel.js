const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true }, //action perfomed ie create, update, delete
  entity: { type: String, required: true }, //entity affected ie user, product, order
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "entity",
    required: true,
  }, //id of entity affected
  timestamp: { type: Date, default: Date.now }, //time action was performed
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //user who performed the action
  user_role: { type: String, required: true }, //role of user who performed the action
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  }, //tenant of user who performed the action
  before: { type: mongoose.Schema.Types.Mixed }, //previous state of entity
  after: { type: mongoose.Schema.Types.Mixed }, //new state of entity
  changed_fields: { type: String }, //fields that were changed
  description: { type: String }, //description of the action performed
});

const Audit = mongoose.model("Audit", auditSchema);
