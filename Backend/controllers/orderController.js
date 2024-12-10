const order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
const Counter = require("../models/counterModel");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const Business  = require("../models/businessModel");
const validator = require("validator");

dotenv.config({ path: "../config.env" });

//create a new order
exports.getAllOrders = async (req, res, next) => {
  try {
    const allOrders = await order.find();

    if (!allOrders) {
      return next(new AppError("No orders found", 404));
    }

    res.status(200).json({
      status: "success",
      result: allOrders.length,
      data: {
        allOrders,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getNextOrderNumber = async (businessCode) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: `orderNumber_${businessCode}` },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequence_value;
};

exports.createOrder = async (req, res, next) => {
  try {
    const orderNumber = uuidv4();
    const items = req.body.items.map((item) => ({
      Product_id: item.Product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));
    for(const item of req.body.items){
      const product  = await Product.findById(item.Product_id);

      if(!product){
        return next(new AppError("Product not found", 404));
      }

      if(item.quantity > product.stock){
        return next(new AppError("Not enough stock", 400));
      }
    }
    const tax = req.body.tax || 0;
    const shippingCost = req.body.shipping_cost || 0;
    const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0) + parseFloat(tax) + parseFloat(shippingCost);

  if(!validator.isEmail(req.body.customer_email)){
    return next(new AppError("Please provide a valid email", 400));
  }
    const newOrder = await order.create({
      order_number: orderNumber,
      order_date: req.body.order_date,
      order_status: req.body.order_status,
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_address: req.body.customer_address,
      items: items,
      total: totalAmount,
      subtotal: items.reduce((acc, item) => acc + item.subtotal, 0),
      tax: req.body.tax,
      shipping_cost: req.body.shipping_cost,
      businessCode: req.body.businessCode,
    });
   
    

    for(const item of req.body.items){
      await Product.findByIdAndUpdate(item.Product_id, {$inc: {stock: - item.quantity}});
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const business = await Business.findOne({businessCode: req.body.businessCode});

    if(!business){
      return next(new AppError("Business not found", 404));
    }

    const mailOptions = {
      from: business.email || "noreply@MTIS.org",
      to: newOrder.customer_email,
      subject: `Order Confirmation: ${newOrder.order_number}`,
      messsage: `Dear ${newOrder.customer_name}, your order has been received and is being processed. Your order number is ${newOrder.order_number}.`,
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if(err){
        console.log('there was an error:',err);
      }else{
        console.log("email sent",info);
      }
    });
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: "success",
      data: {
        newOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getOrder = async (req, res, next) => {
  try {
    const oneOrder = await order.findById(req.params.id);
    if (!oneOrder) {
      return next(new AppError("No order found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        oneOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await order.findByIdAndUpdate
    (req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedOrder) {
      return next(new AppError("No order found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        updatedOrder,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const deleteOrder = await order.findByIdAndDelete(req.params.id);



    if (!deleteOrder) {
      return next(new AppError("No order found with that ID", 404));
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
