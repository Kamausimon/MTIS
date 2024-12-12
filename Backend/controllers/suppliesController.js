const express = require("express");
const Supplies = require("../models/suppliesModel");
const AppError = require("../utils/AppError");
const Suppliers = require("../models/supplierModel");
const products = require("../models/productModel");
const Inventory = require("../models/inventoryModel");


exports.getAllSupplies = async (req, res, next) => {
    try{
        const allSupplies = await Supplies.find();

        if(!allSupplies){
            return next(new AppError("No supplies found", 404));
        }

        res.status(200).json({
            status: "success",
            allSupplies: allSupplies.length,
            data: allSupplies
        });

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
    }
};

exports.registerSupply = async (req, res, next) => {
    try{
        const {supplier, product, quantity, price} = req.body;

        const newSupply = await Supplies.create({
            supplier,
            product,
            quantity,
            price
        });

        if(!newSupply){
            return next(new AppError("Supply not registered", 404));
        }

        const productStock = await Inventory.findOne({where: {productId: product}});

        if(productStock ){
            productStock.stock += quantity;
            await productStock.save();
        }else if(!productStock){
            await Inventory.create({productId: product, stock: quantity});
        }

        res.status(200).json({
            status: "success",
            data: newSupply
        });

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
    }
};

exports.getSupply = async (req, res, next) => {
    try{
        const supply = await Supplies.findById(req.params.id);

        if(!supply){
            return next(new AppError("Supply not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: supply
        });

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
    }
};

exports.updateSupply = async (req, res, next) => {
    try {
        const supply = await Supplies.findByIdAndUpdate(req.params.id,{
            new: true,
            runValidators: true
        })

        if(!supply){
            return next(new AppError("Supply not found", 404));
        }

        res.status(200).json({
            status: "success",
            data: supply
        });
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
}
};

exports.deleteSupply = async (req, res, next) => {
    try{
        const supply = await Supplies.findByIdAndDelete(req.params.id);

        if(!supply){
            return next(new AppError("Supply not found", 404));
        }

        res.status(200).json({
            status: "success",
            message: "Supply deleted"
        });

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
    }
};

exports.getSuppliesBySupplier = async (req, res, next) => {
    try{
        const supplies = await Supplies.find({supplier: req.params.supplierId});

        if(!supplies){
            return next(new AppError("No supplies found", 404));
        }

        res.status(200).json({
            status: "success",
            data: supplies
        });

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message,
            stack: err.stack
        });
    }
};