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

    //generate a login token
    const loginToken = jwt.sign({ id: business._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    res.status(200).json({
      status: "success",
      message: "Business confirmed",
      token: loginToken,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};


exports.protectBusiness = async (req, res, next) => {
  try {
     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        console.log('the headers:', req.headers);
        console.log('the token:', req.headers.authorization?.split(" ")[1]);
     };
     if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
          return next(new AppError("You are not logged in", 401));
     }
       const token = req.headers.authorization.split(" ")[1];
       console.log('the token:', token);  
       if(!token){
         return next(new AppError("You are not logged in", 401));
       }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const business = await Business.findById(decoded.id);
       if(!business || !business.isConfirmed){
         return next(new AppError("Business does not exist or business is not confirmed", 404));
       }
       req.business = business;
       next();
  }catch(err){
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
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
