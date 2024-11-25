const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const options = {
  retryWrites: true,
  w: "majority",
  ssl: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 2000,
  maxPoolSize: 10,
};

const DB = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fby3h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectToDatabase = async () => {
  try {
    console.log("attempting to connect to database");
    console.log(
      "Database URL: ",
      DB.replace(process.env.DATABASE_PASSWORD, "********")
    );
    await mongoose.connect(DB, options);
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    console.log("Error details:", err.message);

    process.exit(1);
  }
};

module.exports = connectToDatabase;
