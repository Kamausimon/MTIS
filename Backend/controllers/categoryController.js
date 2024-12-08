const Category = require("../models/categoryModel");

const AppError = require("../utils/AppError");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

exports.getAllCategories = async (req, res, next) => {
  try {
    const businessCode = req.user.businessCode; // Assume this comes from the authenticated user

    const categories = await Category.find({
      $or: [{ isGlobal: true }, { businessCode }],
    });

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(new AppError("Error fetching categories", 500));
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent_id, children, level, businessCode } = req.body;

    // Ensure only business-specific categories can be created by users
    if (!businessCode) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to create global categories.",
      });
    }

    // Check if a category with the same name exists for the business
    const existingCategory = await Category.findOne({
      name,
      $or: [
        { isGlobal: true }, // Check for global categories with the same name
        { businessCode },   // Check for existing categories in the same business
      ],
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "fail",
        message: "Category name already exists for this business or globally.",
      });
    }

    // Create a new business-specific category
    const newCategory = await Category.create({
      name,
      description,
      parent_id,
      children,
      level,
      businessCode,
      isGlobal: false, // Explicitly mark the category as not global
    });

    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } catch (err) {
    console.error("Error creating category:", err.message);

    res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the category.",
    });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    console.log(category);
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

    if (!Category) {
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
