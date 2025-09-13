const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema({
  doctorName: String,
  mobileNo: String,
  date: String,
  time: String,
  specialization: {
    type: String,
    enum: ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'],
  },
  yearOfExperience: Number,
  qualification: {
    type: String,
    enum: [
      'MBBS - Bachelor of Medicine, Bachelor of Surgery',
      'MD – Doctor of Medicine',
      'MS - Master of Surgery',
      'DDS – Doctor of Dental Surgery',
      'BHMS – Bachelor of Homeopathic Medicine and Surgery',
      'PharmD – Doctor of Pharmacy',
      'Another',
    ],
  },
});

module.exports = mongoose.model('Consultancy', consultancySchema); 