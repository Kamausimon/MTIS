const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router
  .route("/allCategories")
  .get(authController.protectRoute, categoryController.getAllCategories); // Get all categories

  router
  .route("/bizCategories").get(authController.protectRoute, categoryController.bizCategories); // Get all business-specific categories

router
  .route("/createCategory")
  .post(authController.protectRoute, categoryController.createCategory); // Create a new category
router
  .route("/:id")
  .get(authController.protectRoute, categoryController.getCategory); // Get a single category
router
  .route("/:id")
  .patch(
    authController.protectRoute,
    authController.restrictToAdmin,
    categoryController.updateCategory
  ); // Update category
router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToAdmin,
    categoryController.deleteCategory
  ); // Delete category

module.exports = router;
