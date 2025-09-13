const mongoose = require('mongoose');

const calendlyAppointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,
    required: true
  },
  patientPhone: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true,
    default: 'Dr. Smith'
  },
  doctorSpecialty: {
    type: String,
    required: true,
    default: 'General Medicine'
  },
  appointmentDate: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['video', 'phone', 'in-person'],
    default: 'video'
  },
  symptoms: {
    type: String,
    default: ''
  },
  calendlyLink: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  bookingSource: {
    type: String,
    default: 'calendly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
calendlyAppointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CalendlyAppointment', calendlyAppointmentSchema);
