const express = require("express");
const businessController = require("../controllers/businessController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(businessController.registerBusiness); // Get all businesses

Module.exports = router;
