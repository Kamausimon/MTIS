const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { MongoClient, ServerApiVersion } = require("mongodb");

const DB =
  "mongodb+srv://kamausimon217:FwOrzkmWeDqirsH6@cluster0.qip8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(DB, {
  ssl: true,
  tls: true,
  tlsAllowInvalidHostnames: true,

  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    depreciationErrors: true,
  },
});

mongoose.set("debug", true);

const connectToDatabase = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. Database connected successfully");
  } catch (err) {
    // Log error details, including the stack trace
    console.error("Database connection failed");
    console.error("Error details:", err.stack); // Logs the full stack trace

    // Optionally handle shutdown process
    process.exit(1); // Exit the application due to a critical failure
  }
};

mongoose.connection.on("error", (err) => {
  console.error("Database connection error:", err.message);
});

module.exports = connectToDatabase;
