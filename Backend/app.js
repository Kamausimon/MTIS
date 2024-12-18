const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const hpp = require("hpp");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

const app = express();
require("dotenv").config({ path: "./config.env" });

app.use(helmet());
app.options("*", cors());
app.use(cors());

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
app.use(express.json());

app.use(morgan("dev"));

morgan.token("error", request => JSON.stringify(request.error));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :error")
);


app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});


//ROUTES
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const orderRouter = require("./routes/orderRouter");
const supplierRouter = require("./routes/supplierRouter");
const categoryRouter = require("./routes/categoryRouter");
const auditRouter = require("./routes/auditRouter");
const businessRouter = require("./routes/businessRouter");
const suppliesRouter = require("./routes/suppliesRouter");



const EventEmitter = require("events");

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// Increase the default limit of listeners
myEmitter.setMaxListeners(20);

const listener = () => console.log("Event triggered");

// Add a listener to the event
myEmitter.on("event", listener);

// Emit the event
myEmitter.emit("event"); // This will log: "Event triggered"

// Remove the listener
myEmitter.off("event", listener);



//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/audits", auditRouter);
app.use("/api/v1/businesses", businessRouter);
app.use("/api/v1/supplies", suppliesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
