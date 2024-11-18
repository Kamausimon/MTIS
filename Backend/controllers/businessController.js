const Business = require("../models/businessModel");
const User = require("../models/userModel");

exports.registerBusiness = async (req, res, next) => {
  try {
    // Create a new business
    const newBusiness = await Business.create({
      businessName: req.body.businessName,
      email: req.body.email,
      businessType: req.body.businessType,
      admin: adminUser._id,
    });

    //create admin user for the business
    const adminUser = await User.create({
      name: req.body.name || req.body.businessName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: "admin",
      status: "active",
    });

    res.status(201).json({
      status: "success",
      data: {
        business: newBusiness,
        admin: adminUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
