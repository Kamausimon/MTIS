const app = require("./app");
const dotenv = require("dotenv");
const connectToDatabase = require("./db");

dotenv.config({ path: "./config.env" });

// Database connection
const connect = async () => {
  try {
    await connectToDatabase();
    console.log("Database connected successfully");
  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
    process.exit(1); // Fix typo: Process -> process
  }
};

const port = process.env.PORT || 4000;

// Server startup
let server;
const startServer = async () => {
  try {
    await connect();
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

// Error handlers
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

startServer();
