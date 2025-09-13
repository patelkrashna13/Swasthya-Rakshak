const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
  SupplierName: {
    type: String,
    required: true
  },
  ContactPerson: {
    type: String,
  },
  Phone: {
    type: String,
  },
  Email: {
    type: String,
  },
  Address: {
    type: String,
  },
  SupplyType: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema); 