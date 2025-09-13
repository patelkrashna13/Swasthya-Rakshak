const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ['M', 'F', 'Prefer not to say'],
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  typeOfDisease: {
    type: String,
    enum: ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'],
    required: true
  },
  mobileNo: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: String,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: { type: String },
  meetingId: { type: String },
  meetingPassword: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);