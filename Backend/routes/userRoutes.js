const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(userController.getAllUsers); // Get all users
router.route("/").post(userController.createUser); // Create a new user
router.route("/:id").get(userController.getUser); // Get a single user
router.route("/:id").patch(userController.updateUser); // Update user
router.route("/:id").delete(userController.deleteUser); // Delete user

module.exports = router;
