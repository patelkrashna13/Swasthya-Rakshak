const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  patientId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if linking to a Patients collection
    required: true,
  },
  doctorId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if linking to a Doctors collection
    required: true,
  },
  testType: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date, // Store dates as Date objects
    required: true,
  },
  sampleCollectionDate: {
    type: Date, // Store dates as Date objects
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Ordered', 'In Progress', 'Completed', 'Cancelled'], // Enum for allowed statuses
  },
  resultDate: {
    type: Date, // Store dates as Date objects, not required initially
  },
  resultSummary: {
    type: String,
  },
  diagnosticEquipmentId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if linking to equipment
  },
  remarks: {
    type: String,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const LabTest = mongoose.model('LabTest', labTestSchema);

module.exports = LabTest; 