const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");
const Business = require("../models/businessModel");
const Audit = require("../models/auditModel");
const validator = require("validator");

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

exports.signup = async (req, res, next) => {
  try {
    const business = await Business.findOne({
      businessName: req.body.businessName,
    });

    if (!business) {
      return next(new AppError("Business does not exist", 404));
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
      businessName: req.body.businessName,
      businessCode: business.businessCode,
      business: business._id,
    });

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (!validator.isEmail(email)) {
      return next(new AppError("Please provide a valid email", 400));
    }

    //generate token
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, businessCode } = req.body;
    //check if email and password exist
    if (!email || !password || !businessCode) {
      return next(
        new AppError("Please provide email, password and businessCode", 400)
      );
    }
    //check if user exists and password is correct
    const user = await User.findOne({
      email,
      businessCode,
      status: "active",
    }).select("+password");

    await Audit.create({
      action: "LOGIN",
      entity: "USER",
      entityId: user._id,
      perfomedBy: user._id,
      changes: {
        email: user.email,
        businessCode: user.businessCode,
      },
      user_role: user.role,
      businessCode: user.businessCode,
      DESCRIPTION: "User logged in",
    });

    if (user.status === "inactive") {
      return next(new AppError("Please create a new account", 400));
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //if everything is ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.protectRoute = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access", 401)
      );
    }

    //verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //check if user still exists
    const currentUser = await User.findOne({
      _id: decoded.id,
      businessCode: decoded.businessCode,
    });
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist",
          401
        )
      );
    }

    //check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please log in again", 401)
      );
    }

    //grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    businessCode: req.body.businessCode,
  });
  if (!user) {
    return next(new AppError("There is no user with email address", 404));
  }

  //regenerate the random reset token
  const resetToken = user.createResetToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}?businessCode=${
    req.body.businessCode
  }`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    //check if token exists
    const token = req.params;
    const { password, passwordConfirm, businessCode } = req.body;
    if (!token) {
      return next(new AppError("Token does not exist", 400));
    }

    //hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //find the user with the token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
      businessCode,
    });

    //if no user exists
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    //check if password exists
    if (!password || !passwordConfirm) {
      return next(
        new AppError("Please provide password and password confirmation", 400)
      );
    }

    //update user's password and clear reset token
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    //save the user
    await user.save();

    //respond with success message
    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password: ", error);
    next(new AppError("Error resetting password", 500));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //get the user from the collection
    const user = await User.findById(req.user.id).select("+password");

    //check if the posted password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong", 401));
    }
    //if so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    console.error("Error updating password: ", error);
    next(new AppError("Error updating password", 500));
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.restrictToAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  if (req.user.role === "admin") {
    next();
  }
};

exports.restrictToManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  if (req.user.role === "manager") {
    next();
  }
};
