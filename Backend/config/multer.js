const express = require("express");
const multer = require("multer");
const path = require("path");

const imageUploadPath = "C:/Users/ADMIN//Downloads/MTIS/client/public/uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, res, cb) => {
 const allowedTypes  = /jpeg|jpg|png|gif/;
 const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
 const mimetype = allowedTypes.test(file.mimetype);

 if(extname && mimetype){
   return cb(null, true);
 }
   else{
      cb('Images only!');
   }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
