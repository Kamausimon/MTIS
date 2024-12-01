const Business = require("../models/businessModel");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });



//create a jwt sign token function
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, businessCode: user.businessCode },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

//create a send token function
const createSendToken = (user, statusCode, res) => {
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
    const { token } = req.params;
    
    if (!token) {
      return next(new AppError('No token provided', 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const business = await Business.findById(decoded.id);
    if (!business) {
      return next(new AppError('Business not found or token invalid', 404));
    }

    if (business.isConfirmed) {
      return next(new AppError('Email already confirmed', 400));
    }

    business.isConfirmed = true;
    await business.save({ validateBeforeSave: false });

    const loginToken = jwt.sign(
      { id: business._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: 'success',
      message: 'Email confirmed successfully',
      token: loginToken
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 400));
    }
      res.status(400).json({
        status: 'fail',
        message: err.message,
        stack: err.stack
      }
      );
  }
};

// Add specific error types for JWT verification
exports.protectBusiness = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer")) {
      return next(new AppError("Please login to access this route", 401));
    }

    const token = req.headers.authorization.split(" ")[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again.', 401));
      }
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired. Please log in again.', 401));
      }
    }

    const business = await Business.findById(decoded.id);
    if (!business) {
      return next(new AppError('Business no longer exists', 401));
    }

    req.business = business;
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
      stack: err.stack
    });
  }
};


exports.createAdmin = async (req, res, next) => {
  try {
    //find the business
    const business = req.business;

    //create the admin user
    const adminUser = await User.create({
      name: req.body.name || req.body.businessName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: "admin",
      status: "active",
      business: business._id,
      businessCode: business.businessCode,
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
