const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

mongoose.set("debug", true);
const connectToDatabase = async () => {
  try {
    console.log("attempting to connect to database");
    await mongoose
      .connect(
        `mongodb+srv://kamausimon217:FwOrzkmWeDqirsH6@cluster0.qip8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
      )
      .then(() => console.log("Connection successful"))
      .catch((err) => console.error("Connection error:", err.message));
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    console.log("Error details:", err.message);

    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err.message);
});

module.exports = connectToDatabase;
