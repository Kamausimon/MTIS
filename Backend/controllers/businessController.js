const Business = require("../models/businessModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

const businessSignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createConfirmationToken = (id, statusCode, res) => {
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


exports.registerBusiness = async (req, res, next) => {
  try {
    // Create a new business
    const newBusiness = await Business.create({
      businessName: req.body.businessName, //required
      email: req.body.email, //required
      businessType: req.body.businessType, //required
      isconfirmed: false,
    });

    //validation
    if (!validator.isEmail(req.body.email)) {
      return next(new AppError("Please provide a valid email", 400));
    }

    //create a confirmation token
    const token = businessSignToken(newBusiness._id);
    const confirmationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/businesses/confirmEmail/${token}`;

    //send the confirmation email
    await sendEmail({
      email: newBusiness.email,
      subject: "Email Confirmation",
      message: `Click on the link to confirm your email: ${confirmationUrl}`,
    });

    //send the response
    createConfirmationToken(newBusiness._id, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};

exports.confirmBusiness = async (req, res, next) => {
  try {
    const token = req.params.token;

    //decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log( ' the decoded token:', decoded);

    //find the business
    const business = await Business.findById(decoded.id);
    if (!business) {
      return next(new AppError("Business not found", 404));
    }
    business.isConfirmed = true;
    await business.save();
    res.status(200).json({
      status: "success",
      message: "Business confirmed",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    // check if the business is confirmed
    const business = await Business.findById(req.body.businessId);
    if (!business) {
      return next(new AppError("Business not found", 404));
    }
    if (!business.isconfirmed) {
      return next(new AppError("Business not confirmed", 400));
    }

    //create the admin user
    const adminUser = await User.create({
      name: req.body.name || req.body.businessName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: "admin",
      status: "active",
      business: business._id,
    });

    //generate token
    createSendToken(adminUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};
