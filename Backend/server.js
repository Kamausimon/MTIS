const app = require("./app");
const dotenv = require("dotenv");
const connectToDatabase = require("./db");

dotenv.config({ path: "./config.env" });

//call the database connection
const connect = async () => {
  try {
    await connectToDatabase();
    console.log("Database connection successful");
  } catch (err) {
    console.log("Database connection failed");
    console.log(err);
    Process.exit(1);
  }
};

//get the port from the environment variable
const port = process.env.PORT || 3000;

//START THE SERVER
let server;
const startServer = async () => {
  await connect();
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

//handle unhandled promise rejections
process.on("uncaughtException", (err) => {
  console.log(new Date().toISOString(), err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("unhandledRejection", (err) => {
  console.log(new Date().toISOString(), err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
