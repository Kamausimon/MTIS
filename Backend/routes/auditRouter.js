const express = require("express");
const auditController = require("../controllers/auditController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//ROUTES
router.route("/").get(auditController.getAllAudits); // Get all audits
router.route("/").post(auditController.createAudit); // Create a new audit
router.route("/:id").get(auditController.getAudit); // Get a single audit
router.route("/:id").patch(auditController.updateAudit); // Update audit
router.route("/:id").delete(auditController.deleteAudit); // Delete audit

Module.exports = router;
