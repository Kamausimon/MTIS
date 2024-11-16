const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router
  .route("/")
  .get(authController.protectRoute, productController.getAllProducts); // Get all products
router
  .route("/")
  .post(authController.protectRoute, productController.createProduct); // Create a new product
router
  .route("/:id")
  .get(authController.protectRoute, productController.getProduct); // Get a single product
router
  .route("/:id")
  .patch(
    authController.protectRoute,
    authController.restrictToAdmin,
    productController.updateProduct
  ); // Update product
router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToAdmin,
    productController.deleteProduct
  ); // Delete product

module.exports = router;
