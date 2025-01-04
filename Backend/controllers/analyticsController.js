const express = require('express');
const analyticsModel = require('../models/analyticsModel');
const AppError = require('../utils/AppError');
const { stack } = require('sequelize/lib/utils');


exports.logEvent = async (req, res, next) => {
    try{
   const { eventName, eventData, action, page} = req.body;

   const newEvent = new analyticsModel({
       userId: req.user._id,
       businessCode: req.user.businessCode,
       page,
       action,
       eventName,
       eventData,
       userAgent: req.headers['user-agent'],
       ipAddress: req.ip, });

       await newEvent.save();
       res.status(200).json({
           status: 'success',
           message: 'Event logged successfully',
       });

    }catch(err){
        next(new AppError('An error occurred while logging event', 400));
        console.log(err);
        stack:err.stack;
    }
};

exports.getLoggedEvents = async (req, res, next) => {   
    try {
        const businessCode = req.user.businessCode;
        const userId = req.user._id;
 const analytics = await analyticsModel.aggregate([
            { $match: { businessCode, userId } },
            { $group: { _id: '$eventName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        res.status(200).json({
            status: 'success',
            data: { analytics },
        });
    }

    catch (err) {
        next(new AppError('An error occurred while fetching events', 400));
        console.log(err);
        console.log(err.stack);
    }
};