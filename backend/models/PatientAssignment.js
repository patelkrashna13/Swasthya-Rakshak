const mongoose = require('mongoose');

const patientAssignmentSchema = mongoose.Schema({
  PatientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Assuming you have a Patient model
    required: true
  },
  WardID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  BedID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true
  },
  AdmitDate: {
    type: Date,
    required: true
  },
  Status: {
    type: String,
    default: 'Admitted'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PatientAssignment', patientAssignmentSchema); 