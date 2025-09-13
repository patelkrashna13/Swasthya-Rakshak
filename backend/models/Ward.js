const mongoose = require('mongoose');

const wardSchema = mongoose.Schema({
  WardName: {
    type: String,
    required: true
  },
  Type: {
    type: String,
  },
  Capacity: {
    type: Number,
    required: true
  },
  CurrentOccupancy: {
    type: Number,
    default: 0
  },
  Location: {
    type: String,
  },
  Status: {
    type: String,
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ward', wardSchema); 