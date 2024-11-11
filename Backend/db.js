const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const DB = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fby3h.mongodb.net/${process.env.DATABASE_NAME}`;

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
};

module.exports = connectToDatabase;
