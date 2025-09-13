const mongoose = require('mongoose');

const purchaseOrderSchema = mongoose.Schema({
  OrderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  SupplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  OrderedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff', // Assuming a Staff model exists
  },
  Status: {
    type: String,
    default: 'Pending'
  },
  ExpectedDeliveryDate: {
    type: Date,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema); 