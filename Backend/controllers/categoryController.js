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
    const newCategory = Category.create({
      name: req.body.name,
      description: req.body.description,
      parent_id: req.body.parent_id,
      children: req.body.children,
      level: req.body.level,
      businessCode: req.body.businessCode,
    });

    res.status(201).json({
      status: "success",
      data: {
        newCategory,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(new AppError("No category found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
