const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/getDashData').get(authController.protectRoute, dashboardController.getDashboardData);

module.exports = router;