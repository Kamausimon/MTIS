const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(productController.getAllProducts); // Get all products
router.route("/").post(productController.createProduct); // Create a new product
router.route("/:id").get(productController.getProduct); // Get a single product
router.route("/:id").patch(productController.updateProduct); // Update product
router.route("/:id").delete(productController.deleteProduct); // Delete product

module.exports = router;
