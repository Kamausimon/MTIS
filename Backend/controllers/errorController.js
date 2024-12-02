const AppError = require("../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const valueMatch = err.message.match(/(["'])(\\?.)*?\1/);
  const value = valueMatch ? valueMatch[0] : "not original ";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = `Invalid input data. ${err.message}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  const message = `${err.message}: Invalid token. Please log in again!`;
  return new AppError(message, 401);
};

const handleTokenExpiredError = (err) => {
  const message = `${err.message}: Your token has expired. Please log in again!`;
};

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  //Operational trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //handle castError and send message to client
  else if (err.name === "CastError") {
    const castError = handleCastErrorDB(err);
    res.status(castError.statusCode).json({
      status: castError.status,
      message: castError.message,
    });
  }
  //handle validation error and send message to client
  else if (err.code === 11000) {
    const duplicateError = handleDuplicateErrorDB(err);
    res.status(duplicateError.statusCode).json({
      status: duplicateError.status,
      message: duplicateError.message,
    });
  }

  if (err.name === "ValidationError") {
    const validationError = handleValidationErrorDB(err);
    res.status(validationError.statusCode).json({
      status: validationError.status,
      message: validationError.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    const jsonTokenErr = handleJWTError(err);
    res.status(jsonTokenErr.statusCode).json({
      status: jsonTokenErr.status,
      message: jsonTokenErr.message,
    });
  }

  if (err.name === "TokenExpiredError") {
    const tokenExpiredErr = handleTokenExpiredError(err);
    res.status(tokenExpiredErr.statusCode).json({
      status: tokenExpiredErr.status,
      message: tokenExpiredErr.message,
    });
  } else {
    //send generic message
    console.log("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

Module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, req, res);
  }
};
