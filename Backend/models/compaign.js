const { Number } = require('mongoose')
const mongoose = require('mongoose')

const Compaign = mongoose.model('Compaign', {
  title: {
    type: String,
    required: true,
  },

  planDetails: {
    type: String,
    required: true,
  },
  fundingType: {
    type: String,
    required: false,
  },
  pitchMaterial: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: 1,
  },
  videoPath: {
    type: String,
    required: false,
  },
  imagePath: {
    type: String,
    required: true,
  },

  postDate: {
    type: String,
    required: true,
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = Compaign
