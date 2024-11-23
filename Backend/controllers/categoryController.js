const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return next(new AppError("No categories found", 404));
    }
    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = Category.create({});
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getCategory = async (req, res, next) => {};
exports.updateCategory = async (req, res, next) => {};
exports.deleteCategory = async (req, res, next) => {};
