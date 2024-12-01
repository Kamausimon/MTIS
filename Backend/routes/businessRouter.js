const express = require("express");
const businessController = require("../controllers/businessController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/registerBusiness").post(businessController.registerBusiness); // Get all businesses
router.route("/confirmEmail/:token").patch(businessController.confirmBusiness); // confirm email
router.route("/createAdmin").post(businessController.protectBusiness, businessController.createAdmin); // create admin

module.exports = router;
