const express = require("express");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const Business = require("../models/businessModel");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

//create a jwt sign token function
exports.signToken = (user) => {
  return jwt.sign(
    { id: user._id, businessCode: user.businessCode },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

//create a send token function
exports.createSendToken = (user, statusCode, res) => {
  //create a jwt token
  const token = signToken(user);

  //create a cookie
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //set cookie options to secure if in production
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  //set the cookie in a cookie called jwt
  res.cookie("jwt", token, cookieOptions);

  //remove the password from the output
  user.password = undefined;

  //send the response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const businessSignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createConfirmationToken = (id, statusCode, res) => {
  const token = businessSignToken(id);
  const cookieOptions = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};
