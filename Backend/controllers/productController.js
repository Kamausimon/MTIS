const product = require("../models/productModel");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/.env" });

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await product.find();

    if (!products) {
      return next(new AppError("No products found", 404));
    }

    res.status(200).sjon({
      status: "success",
      result: products.length,
      data: {
        products,
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

    const newProduct = await product.create({
      name: req.body.name,
      sku: sku,
      description: req.body.description,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
