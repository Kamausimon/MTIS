const express = require("express");
const businessController = require("../controllers/businessController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/registerBusiness").post(businessController.registerBusiness); // Get all businesses
router.route("/confirmBusiness/:token").patch(businessController.confirmBusiness); // confirm email
router.route("/createAdmin").post( businessController.getBusiness, businessController.createAdmin); // create admin

module.exports = router;
