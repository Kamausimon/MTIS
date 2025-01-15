const express = require('express');
const settingsModel = require('../models/settingsModel');
const AppError = require('../utils/AppError');

exports.getSettings = async (req,res,next) => {
    try{
        const {businessCode} = req.query;

        if(!businessCode){
            return next(new AppError('Business code is required', 400));
        }
        const settings = await settingsModel.find({businessCode:businessCode});
        if(!settings){
            return res.status(404).json({
                status: 'fail',
                message: 'No settings found'
            });
    
        }
        res.status(200).json({
            status: 'success',
            data: settings
        });
    }  catch(err){
        console.log(err);
        return next(new AppError('Error fetching settings', 400));
    }
};

exports.createSettings = async () => {
    try{
      const {key,value, businessCode} = req.body;

      if(!key || !value || !businessCode){
            return next(new AppError('Key, value and businessCode are required', 400));
      }

      //check if settings already exists
      const settingsExists = await settingsModel.findOne({key:key, businessCode:businessCode});

        if(settingsExists){
            return res.status(400).json({
                status: 'fail',
                message: 'Settings already exists for this business'
            });
        }

        const newSettings = await settingsModel.create({key,value});
        return res.status(201).json({
            status: 'success',
            data: newSettings
        });

    }catch(err){
        console.log(err);
        return next(new AppError('Error creating settings', 400));
    }
}

exports.updateSettings = async (req,res,next) => {
      try{
        const {key,value,businessCode} = req.body;
        if(!key || !value || !businessCode){
            return next(new AppError('Key, value and businessCode are required', 400));
        }
        const updatedSettings = await settingsModel.findOneAndUpdate({key:key},{value:value},{businessCode},{new:true, upsert:true});
        return res.status(200).json({
            status: 'success',
            data: updatedSettings
        });
      }catch(err){
        console.log(err);
       return next(new AppError('Error updating settings', 400));
      }
};

