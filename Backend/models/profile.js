const mongoose = require('mongoose')

const Profile = mongoose.model('Profile', {
  companyName: {
    type: String,
    required: true,
    unique: true,
  },

  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  companyDescription: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = Profile
