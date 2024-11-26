const mongoose = require("mongoose");
const dotenv = require("dotenv");
const seedCategories = require("./categorySeeder");

dotenv.config({ path: "../config.env" });

const DB = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.fby3h.mongodb.net/${process.env.DATABASE_NAME}`;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connection successful");
    seedCategories();
  })
  .catch((err) => {
    console.log("Database connection failed", err.message);
  });
