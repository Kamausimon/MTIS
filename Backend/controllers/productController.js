const product = require("../models/productModel");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
const Category = require("../models/categoryModel");



dotenv.config({ path: "../config.env" });

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await product.find();

    if (!products) {
      return next(new AppError("No products found", 404));
    }

    const lowStockProducts = products.filter((product) => product.isLowStock());

    res.status(200).json({
      status: "success",
      result: products.length,
      lowStockProducts: lowStockProducts.length,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};


exports.getLowStockProducts = async (req, res, next) => {
  try {
    // Validate user and business code
    if (!req.user || !req.user.businessCode) {
      return next(new AppError('Not authorized', 401));
    }

    const lowStockProducts = await product.aggregate([
      {
        $match: {
          businessCode: req.user.businessCode
        }
      },
      {
        $match: {
          $expr: {
            $lte: ["$stock", "$low_stock_threshold"]
          }
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      results: lowStockProducts.length,
      data: lowStockProducts
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack
    });
  }
};



exports.createProduct = async (req, res, next) => {
  try {
    console.log('request body', req.body);

    if (!req.body.categoryId) {
      return next(new AppError("Category is required", 400));
    }

    const sku = uuidv4();
    let imageUrl = "";

    if (req.file) {
      imageUrl =
        req.file.location || `../public/uploads/products/${req.file.filename}`;
    }

    console.log('looking for category with ', {
      _id: req.body.categoryId,
      $or: [{ isGlobal: true }, { businessCode: req.body.businessCode }],
    })

    const existingCategory  = await Category.findOne({
      _id: req.body.categoryId,
      $or: [{ isGlobal: true }, { businessCode: req.body.businessCode }],
    });

    console.log('found category', existingCategory);

    if(!existingCategory){
      return next(new AppError("Category not found", 404))};

    const newProduct = await product.create({
      name: req.body.name,
      sku: sku,
      description: req.body.description,
      category: req.body.categoryId,
      businessCode: req.body.businessCode,
      price: req.body.price,
      stock: req.body.stock,
      low_stock_threshold: req.body.low_stock_threshold,
      image_url: imageUrl,
    });

 

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const singleProduct = await product.findById(req.params.id);

    if (!singleProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        singleProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });


    if (!updatedProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleteProduct = await product.findByIdAndDelete(req.params.id);


    if (!deleteProduct) {
      return next(new AppError("Product not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
