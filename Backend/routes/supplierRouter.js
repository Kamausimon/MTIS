const express = require("express");
const supplierController = require("../controllers/supplierController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router
  .route("/getAllSuppliers")
  .get(authController.protectRoute, supplierController.getAllSuppliers); // Get all suppliers
router
  .route("/createSupplier")
  .post(
    authController.protectRoute,
    authController.restrictToAdmin,
    supplierController.createSupplier
  ); // Create a new supplier
router
  .route("/:id")
  .get(authController.protectRoute, supplierController.getSupplier); // Get a single supplier
router
  .route("/:id")
  .patch(authController.protectRoute, supplierController.updateSupplier); // Update supplier
router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToAdmin,
    supplierController.deleteSupplier
  ); // Delete supplier

module.exports = router;
