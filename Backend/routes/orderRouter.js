const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(orderController.getAllOrders); // Get all orders
router.route("/").post(orderController.createOrder); // Create a new order
router.route("/:id").get(orderController.getOrder); // Get a single order
router.route("/:id").patch(orderController.updateOrder); // Update order
router.route("/:id").delete(orderController.deleteOrder); // Delete order

module.exports = router;
