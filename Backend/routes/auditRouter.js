const express = require("express");
const auditController = require("../controllers/auditController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router
  .route("/")
  .get(
    authController.protectRoute,
    authController.restrictToManager,
    auditController.getAllAudits
  ); // Get all audits
router
  .route("/")
  .post(
    authController.protectRoute,
    authController.restrictToAdmin,
    auditController.createAudit
  ); // Create a new audit
router
  .route("/:id")
  .get(
    authController.protectRoute,
    authController.restrictToManager,
    auditController.getAudit
  ); // Get a single audit
router
  .route("/:id")
  .patch(
    authController.protectRoute,
    authController.restrictToAdmin,
    auditController.updateAudit
  ); // Update audit
router
  .route("/:id")
  .delete(
    authController.protectRoute,
    authController.restrictToAdmin,
    auditController.deleteAudit
  ); // Delete audit

Module.exports = router;
