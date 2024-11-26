const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = `mongodb+srv://kamausimon:${process.env.DATABASE_PASSWORD}@cluster0.fby3h.mongodb.net/${process.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set("debug", true);
const connectToDatabase = async () => {
  try {
    console.log("attempting to connect to database");
    await mongoose
      .connect(DB)
      .then(() => console.log("Connection successful"))
      .catch((err) => console.error("Connection error:", err.message));
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    console.log("Error details:", err.message);

    process.exit(1);
  }
};

module.exports = connectToDatabase;
