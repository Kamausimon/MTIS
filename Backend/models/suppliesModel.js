const mongoose = require("mongoose");


const suppliesSchema = new mongoose.Schema({});

const Supplies = mongoose.model("Supplies", suppliesSchema);
module.exports = Supplies;