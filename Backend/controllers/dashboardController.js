const express = require('express');
const AppError = require('../utils/AppError');
const orders = require('../models/orderModel');
const products = require('../models/productModel');
const suppliers = require('../models/supplierModel');
const supplies = require('../models/suppliesModel');

exports.getDashboardData = async (req, res, next) => {
     try{
          console.log('request received', req.headers, req.user, req.body, req.query);
            const totalSuppliers = await suppliers.countDocuments({ businessCode: req.user.businessCode });
            const totalSupplies = await supplies.countDocuments({ businessCode: req.user.businessCode });
            const totalOrders = await orders.countDocuments({ businessCode: req.user.businessCode });
            const totalProducts = await products.countDocuments({ businessCode: req.user.businessCode });
            res.status(200).json({
                 status: 'success',
                 data: {
                        metrics: {
                             totalSuppliers,
                             totalSupplies,
                             totalOrders,
                             totalProducts
                        },
                        recentActivities: []
                 }
            });

     }catch(err){
          next(new AppError(err.message, 400));
     }
}