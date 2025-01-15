const mongooose = require('mongoose');

const settingsSchema = new mongooose.Schema({
  //key value pair
  key: {
    type: String,
    required: true,
  }, 
  value: {
    type: String,
    required: true,
  }, 
  //businessCode 
  businessCode: {
    type: String,
    required: true,
  },
}, {
    timestamps: true,
});

module.exports = mongooose.model('Settings', settingsSchema);