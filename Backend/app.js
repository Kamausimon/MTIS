const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
require("dotenv").config({ path: "./config.env" });

app.use(helmet());
app.options("*", cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 10 minutes",
  headers: true,
});

app.use("/api", limiter);

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(hpp()); // Prevent http param pollution

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ROUTES
