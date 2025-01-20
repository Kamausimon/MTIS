const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  businessCode: {
    type: String,
    required: true,
  },
  profile: {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
  },
  privacy: {
    showProfilePicture: {
      type: Boolean,
      default: true,
    },
    showLastSeen: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);