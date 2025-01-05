const supplier = require("../models/supplierModel");

const AppError = require("../utils/AppError");
const dotenv = require("dotenv");

dotenv.config({ path: "../config.env" });

exports.getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplier.find();

    if (!suppliers || suppliers.length === 0) {
      return next(new AppError("No suppliers found", 404));
    }

    res.status(200).json({
      status: "success",
      result: suppliers.length,
      data: {
        suppliers: suppliers,
      },
    });
  } catch (err) {
    console.error("Error:", err); // Log errors for debugging
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.createSupplier = async (req, res, next) => {
      

  try {
    const newSupplier = await supplier.create({
      name: req.body.name,
      contact_name: req.body.contact_name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      website: req.body.website,
      products: req.body.products,
      businessCode: req.body.businessCode,
      status: req.body.status,
      notes: req.body.notes,
    });

    if (!newSupplier) {
      return next(new AppError("Could not create supplier", 404));
    }

    //if supplier is created successfully, return success message

    res.status(201).json({
      status: "success",
      data: {
        newSupplier,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getSupplier = async (req, res, next) => {
  try {
    const oneSupplier = await supplier.findById(req.params.id);

    if (!oneSupplier) {
      return next(new AppError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        oneSupplier,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateSupplier = async (req, res, next) => {
  try {
    const updatedSupplier = await supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSupplier) {
      return next(new AppError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedSupplier,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteSupplier = async (req, res, next) => {
  try {
    const deletedsupplier = await supplier.findByIdAndDelete(req.params.id);


    if (!deletedsupplier) {
      return next(new AppError("Supplier not found", 404));
    }
    res.status(201).json({
      status: "success",
      message: "supplier deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
