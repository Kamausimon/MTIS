const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(categoryController.getAllCategories); // Get all categories
router.route("/").post(categoryController.createCategory); // Create a new category
router.route("/:id").get(categoryController.getCategory); // Get a single category
router.route("/:id").patch(categoryController.updateCategory); // Update category
router.route("/:id").delete(categoryController.deleteCategory); // Delete category

module.exports = router;
