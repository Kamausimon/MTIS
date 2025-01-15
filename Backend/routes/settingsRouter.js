const express = require('express');
const authController = require('../controllers/authController');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.route('/getSettings').get(authController.protectRoute, authController.restrictToAdmin, settingsController.getSettings);
router.route('/createSettings').post(authController.protectRoute, authController.restrictToAdmin, settingsController.createSettings);
router.route('/updateSettings').patch(authController.protectRoute, authController.restrictToAdmin, settingsController.updateSettings);

module.exports = router;