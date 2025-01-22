const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

// ROUTES
router.route("/signup").post(authController.signup); // Signup
router.route("/login").post(authController.login); // Login
router.route("/logout").post(authController.logout); // Logout
router.route("/forgotPassword").post(authController.forgotPassword); // Forgot password
router.route("/resetPassword/:token/:businessCode").patch(authController.resetPassword); // Reset password
router
  .route("/updatePassword")
  .patch(authController.protectRoute, authController.updatePassword); // Update password

router
  .route("/adminGetAllUsers")
  .get(
    authController.protectRoute,
    authController.restrictToAdmin,
    userController.getAllUsers
  ); // Get all users

router
  .route("/:id")
  .get(authController.protectRoute, userController.getOneUser); // Get a single user
router
  .route("/:id")
  .patch(authController.protectRoute, userController.updateUserDetails); // Update user
router
  .route("/:id")
  .delete(authController.protectRoute, userController.deleteUser); // Delete user

module.exports = router;
