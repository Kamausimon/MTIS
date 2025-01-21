const order = require("../models/orderModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
const Counter = require("../models/counterModel");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const Business  = require("../models/businessModel");
const validator = require("validator");
const Invoice = require("../models/invoiceModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: "../config.env" });

//create a new order
exports.getAllOrders = async (req, res, next) => {
  try {
    const allOrders = await order.find({ businessCode: req.user.businessCode });

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



const generateInvoicePDF = async (invoice) => {
  const doc = new PDFDocument();
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => console.log('PDF generated successfully'));
  doc.on('error', (err) => {
    throw new Error(`Error generating PDF: ${err.message}`);
  });

  // Add invoice details
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Invoice Number: ${invoice.invoice_number}`);
  doc.text(`Customer Name: ${invoice.customer_name}`);
  doc.text(`Customer Email: ${invoice.customer_email}`);
  doc.text(`Order Date: ${invoice.createdAt}`);
  doc.moveDown();

  doc.text('Items:');

  for (const [index, item] of invoice.items.entries()) {
    const product = await Product.findById(item.product_id).select('name'); // Fetch product name
    const product_name = product ? product.name : 'Unknown Product';
    doc.text(
      `${index + 1}. ${product_name} - ${item.quantity} x ksh${item.price} = ksh${item.item_subtotal}`
    );
  }

  doc.moveDown();
  doc.text(`Subtotal: ksh${invoice.subtotal}`);
  doc.text(`Tax: ksh${invoice.tax}`);
  doc.text(`Shipping Cost: ksh${invoice.shipping_cost}`);
  doc.text(`Total: ksh${invoice.total}`);

  doc.end(); // Finalize the PDF document

  return Buffer.concat(chunks); // Return the PDF as a buffer
};



exports.createOrder = async (req, res, next) => {
  try {
    const orderNumber = uuidv4();
    const items = req.body.items.map((item) => ({
      Product_id: item.Product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      item_subtotal: item.quantity * item.price,
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
    const totalAmount = items.reduce((acc, item) => acc + parseFloat(item.item_subtotal), 0) + parseFloat(tax) + parseFloat(shippingCost);

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
      subtotal: items.reduce((acc, item) => acc + item.item_subtotal, 0),
      tax: req.body.tax,
      shipping_cost: req.body.shipping_cost,
      businessCode: req.body.businessCode,
    });
   
    const invoice = await Invoice.create({
      invoice_number: uuidv4(),
      order_id: newOrder._id,
      customer_name: newOrder.customer_name,
      customer_email: newOrder.customer_email,
      items: newOrder.items.map((item) => ({
        product_id: item.Product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        item_subtotal: item.item_subtotal,
      })),
      subtotal: newOrder.subtotal,
      total: newOrder.total,
      tax: newOrder.tax,
      shipping_cost: newOrder.shipping_cost,
      businessCode: newOrder.businessCode,
      payment_status: 'pending',
    });

    const pdfBuffer =await generateInvoicePDF(invoice);
    console.log('pdf buffer length:', pdfBuffer.length);
    if(pdfBuffer.length === 0){
      throw new AppError("Error generating PDF", 500);
    }
    const filePath  = `./public/invoices/Invoice-${newOrder.order_number}.pdf`;
    console.log('file saved at:', filePath);

    //ensure that the file is written to the disk
    const dirPath = path.dirname(filePath);

    if(!fs.existsSync(dirPath)){ //check if the directory exists
      fs.mkdirSync(dirPath, {recursive: true}); //create the directory if it does not exist
    }

    fs.writeFileSync(filePath, pdfBuffer, 'binary');

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
      from: business.email,
      to: newOrder.customer_email,
      subject: `Order Confirmation & Invoice: ${newOrder.order_number}`,
      text: `Dear ${newOrder.customer_name},\n\nThank you for your order!\n\nOrder Number: ${newOrder.order_number}\nOrder Date: ${newOrder.order_date}\nTotal: ${newOrder.total}\n\nPlease find your invoice attached.\n\nBest regards,\n${business.businessName}`,
      attachments: [
        {
          filename: `Invoice-${newOrder.order_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    };

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
