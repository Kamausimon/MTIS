const Category = require("../models/categoryModel");
const mongoose = require("mongoose");
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
      data:categories,
  
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(new AppError("Error fetching categories", 500));
  }
};

exports.bizCategories = async (req, res, next) => {
  try{
        
    const businessCode = req.user.businessCode;

    const categories = await Category.find({
   $or:[{isGlobal:false},{businessCode}]
    });

    res.status(200).json({
      status: "success",
      data: categories,
    });


  }
catch(err) {
    res.status(400).json({
      status: "fail",
      message: err,
      stack: err.stack,
  })
}}



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

    // Validate `parent_id` if it exists
    if (parent_id && !mongoose.Types.ObjectId.isValid(parent_id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid parent_id. Must be a valid ObjectId or null.",
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
      parent_id: parent_id || null, // Use null if no parent is provided
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
    res.status(500).json({
      status: "fail",
      message: "An error occurred while creating the category.",
      stack: err.stack,
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


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    // Prevent deletion of global categories
    if (category.isGlobal) {
      return res.status(403).json({
        status: 'fail',
        message: 'Global categories cannot be deleted.',
      });
    }

    // Proceed with deletion
    await Category.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      message: 'Category deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'An error occurred while deleting the category.',
      stack: err.stack,
    });
  }
};

