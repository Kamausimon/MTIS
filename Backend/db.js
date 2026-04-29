const mongoose = require("mongoose");
const dotenv = require("dotenv");



const DB = `mongodb+srv://kamausimon217:${process.env.DATABASE_PASSWORD}@cluster1.iwigemq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
const connectToDatabase = async () => {
  await mongoose.connect(DB);
};

module.exports = connectToDatabase;
