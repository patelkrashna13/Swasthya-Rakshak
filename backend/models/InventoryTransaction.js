const mongoose = require('mongoose');

const inventoryTransactionSchema = mongoose.Schema({
  ItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  TransactionType: {
    type: String,
    required: true,
    enum: ['Addition', 'Removal', 'Adjustment', 'Expiry']
  },
  Quantity: {
    type: Number,
    required: true
  },
  TransactionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  PerformedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff', // Assuming a Staff model exists
  },
  Remarks: {
    type: String,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema); 