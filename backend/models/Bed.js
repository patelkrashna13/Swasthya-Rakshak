const mongoose = require('mongoose');

const bedSchema = mongoose.Schema({
  WardID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  BedNumber: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bed', bedSchema); 