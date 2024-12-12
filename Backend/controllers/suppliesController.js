const express = require("express");
const Supplies = require("../models/suppliesModel");
const AppError = require("../utils/AppError");
const Suppliers = require("../models/supplierModel");
const Product = require("../models/productModel");
const Inventory = require("../models/inventoryModel");
const mongoose = require("mongoose");


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
    // Start session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { supplierId, productId, quantity, price , businessCode} = req.body;

        // Validate required fields
        if (!supplierId || !productId || !quantity || !price || !businessCode) {
            return next(new AppError('Missing required fields', 400));
        }

        // Find product first
        const product = await Product.findOne({ 
            _id: productId,
            businessCode 
        });
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        const supply = {
            supplierId,
            productId,
            quantity: Number(quantity),
            price: Number(price),
            businessCode
        };

        // Create supply record
        const newSupply = await Supplies.create([supply], { session });

        // Update product stock
        product.stock += supply.quantity;
        await product.save({ session });

        // Update or create inventory
        const productStock = await Inventory.findOne({ productId: supply.productId, businessCode });
        if (productStock) {
            productStock.quantity += supply.quantity;
            await productStock.save({ session });
        } else {
            await Inventory.create([{
                productId: supply.productId,
                quantity: supply.quantity,
                price: supply.price,
                businessCode
            }], { session });
        }

        // Commit transaction
        await session.commitTransaction();

        res.status(201).json({
            status: "success",
            data: {
                supply: newSupply[0],
                product: product,
                inventory: productStock,
                businessCode
            }
        });

    } catch (err) {
        // Abort transaction on error
        await session.abortTransaction();
        return next(new AppError(err.message, 400));
    } finally {
        session.endSession();
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
    try {
        const { supplierId } = req.params;
        // Fixed query with new ObjectId
        const query = {
            supplierId,
            businessCode: req.user.businessCode
        };
    

        const supplies = await Supplies.find(query).sort({ createdAt: -1 })
        .populate({
            path: 'supplierId',
            select: 'name email phone'
        })
        .populate({
            path: 'productId',
            select: 'name price stock'
        });
         

        console.log('Found supplies count:', supplies.length);

        if (!supplies || supplies.length === 0) {
            return res.status(200).json({
                status: "success",
                results: 0,
                message: "No supplies found for this supplier",
                data: []
            });
        }

        res.status(200).json({
            status: "success",
            results: supplies.length,
            data: supplies
        });

    } catch (err) {
        console.error('Error:', err);
        return next(new AppError(err.message, 400));
    }
};