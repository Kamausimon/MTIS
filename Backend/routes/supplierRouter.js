const express = require("express");
const supplierController = require("../controllers/supplierController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(supplierController.getAllSuppliers); // Get all suppliers
router.route("/").post(supplierController.createSupplier); // Create a new supplier
router.route("/:id").get(supplierController.getSupplier); // Get a single supplier
router.route("/:id").patch(supplierController.updateSupplier); // Update supplier
router.route("/:id").delete(supplierController.deleteSupplier); // Delete supplier

module.exports = router;
