const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = `mongodb+srv://kamausimon217:${process.env.DATABASE_PASSWORD}@cluster0.qip8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const connectToDatabase = async () => {
  await mongoose.connect(DB);
};

module.exports = connectToDatabase;
