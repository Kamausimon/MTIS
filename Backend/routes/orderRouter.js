const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router
  .route("/")
  .get(authController.protectRoute, orderController.getAllOrders); // Get all orders
router
  .route("/")
  .post(authController.protectRoute, orderController.createOrder); // Create a new order
router.route("/:id").get(authController.protectRoute, orderController.getOrder); // Get a single order
router
  .route("/:id")
  .patch(authController.protectRoute, orderController.updateOrder); // Update order
router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToManager,
    orderController.deleteOrder
  ); // Delete order

module.exports = router;
