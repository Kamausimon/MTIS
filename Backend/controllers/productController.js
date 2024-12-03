const product = require("../models/productModel");

const AppError = require("../utils/AppError");
const dotenv = require("dotenv");

const { stack } = require("../app");

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
    const lowStockProdusts = await product.find({
      businessCode: req.params.businessCode,
      stock: { $lte: "$low_stock_threshold" },
    });

    res.status(200).json({
      status: "success",
      result: lowStockProdusts.length,
      data: {
        products: lowStockProdusts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const sku = uuidv4();
    let imageUrl = "";

    if (req.file) {
      imageUrl =
        req.file.location || `/public/uploads/products/${req.file.filename}`;
    }

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
        newProduct,
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
    const product = await product.findById(req.params.id);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });


    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
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
    const product = await product.findByIdAndDelete(req.params.id);


    if (!product) {
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
