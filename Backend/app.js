const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(hpp()); // Prevent http param pollution

//ROUTES
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const supplierRouter = require("./routes/supplierRouter");
const categoryRouter = require("./routes/categoryRouter");
const auditRouter = require("./routes/auditRouter");
const businessRouter = require("./routes/businessRouter");

//ROUTES MIDDLEWARE
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/audits", auditRouter);
app.use("/api/v1/businesses", businessRouter);

module.exports = app;
