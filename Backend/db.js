const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const DB =  

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    process.exit(1);
  }
}

module.exports = connectToDatabase;
