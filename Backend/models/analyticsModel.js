const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    businessCode: {
        type: String,
        required: true,
        ref: "Business",
    },
    sessionId: {
        type: String,
        required: true,
    },
    page: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
 eventName: {
    type: String,
    required: true,
 },
 eventData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
 }, 
 userAgent: {
    type: String,
    required: true,
 },
    ipAddress: {
        type: String,
        required: true,
    },
}, 
{ timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;