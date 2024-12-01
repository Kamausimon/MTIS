const Audit = require("../models/auditModel");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");

exports.getAllAudits = async (req, res, next) => {
  try {
    const audits = await Audit.find();

    if (!audits) {
      return next(new AppError("No audits found", 404));
    }

    res.status(200).json({
      status: "success",
      result: audits.length,
      data: {
        audits,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createAudit = async (action, entity, entityId, perfomedBy, changes, userRole, businessCode) => {
  try {
   await Audit.create({
      action,
      entity,
      entityId,
      perfomedBy,
      changes,
      userRole,
      businessCode,
    });


  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      stack: err.stack,
    });
  }
};
exports.getAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id);

    if (!audit) {
      return next(new AppError("No audit found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        audit,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!audit) {
      return next(new AppError("No audit found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        audit,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
exports.deleteAudit = async (req, res, next) => {
  try {
    const audit = await Audit.findByIdAndDelete(req.params.id);
    if (!audit) {
      return next(new AppError("No audit found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
