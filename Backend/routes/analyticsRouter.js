const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/logger').post(authController.protectRoute, authController.restrictToAdmin , analyticsController.logEvent);

router.route('/getAnalytics').get(authController.protectRoute, authController.restrictToAdmin, analyticsController.getLoggedEvents);

module.exports = router;