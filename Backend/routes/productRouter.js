const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const {upload} = require("../config/multer");


const router = express.Router();

//ROUTES
router.route("/allProducts").get(
  authController.protectRoute, 
  productController.getAllProducts); // Get all products

router.route("/").post(
    authController.protectRoute,
    upload.single("image"),
    productController.createProduct
  ); // Create a new product

router.route("/:id").get(
    authController.protectRoute, 
    productController.getProduct); // Get a single product

router.route("/:id").patch(
    authController.protectRoute,
    authController.restrictToAdmin,
    productController.updateProduct
  ); // Update product

router.route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToAdmin,
    productController.deleteProduct
  ); // Delete product

router.route(
  "/low-stock" ).get(
  authController.protectRoute,
  productController.getLowStockProducts
); // Get low stock products

module.exports = router;
