const order = require("../models/orderModel");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
const Counter = require("../models/counterModel");

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
    const orderNumber = await getNextOrderNumber(req.body.businessCode);
    const items = req.body.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));
    const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);
    const newOrder = await order.create({
      order_number: orderNumber,
      order_date: req.body.order_date,
      order_status: req.body.order_status,
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_address: req.body.customer_address,
      items: items,
      total: totalAmount,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      shipping_cost: req.body.shipping_cost,
      businessCode: req.body.businessCode,
    });

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
    const order = await order.findById(req.params.id);
    if (!order) {
      return next(new AppError("No order found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        order,
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
    const updatedOrder = await order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await order.findByIdAndDelete(req.params.id);
    if (!order) {
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
