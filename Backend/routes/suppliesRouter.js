const express = require("express");
const authController = require("../controllers/authController");
const suppliesController = require("../controllers/suppliesController");

const router = express.Router();



// Fixed middleware name from protect to protectRoute
router.route("/getAllSupplies")
  .get(authController.protectRoute, suppliesController.getAllSupplies);

router.route("/registerSupply")
  .post(authController.protectRoute, suppliesController.registerSupply);

router.route("/:id")
  .get(authController.protectRoute, suppliesController.getSupply)
  .patch(authController.protectRoute, authController.restrictToAdmin, suppliesController.updateSupply)
  .delete(authController.protectRoute, authController.restrictToAdmin, suppliesController.deleteSupply);

  router.route('/getSuppliesBySupplier/:supplierId').get(authController.protectRoute,authController.restrictToAdmin, suppliesController.getSuppliesBySupplier);

module.exports = router;