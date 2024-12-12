const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  lastUpdated: {
    type: Date,
    default: Date.now()
  },
  businessCode: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});


const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;