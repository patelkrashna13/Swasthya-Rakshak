const mongoose = require('mongoose');

const staffSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
    },
    department: {
      type: String,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: String,
    },
    mobileNo: {
      type: String,
    },
    email: {
      type: String,
    },
    schedule: {
      type: String,
    },
    employmentStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Staff', staffSchema); 