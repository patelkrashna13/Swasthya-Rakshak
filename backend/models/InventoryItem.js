const mongoose = require('mongoose');

const inventoryItemSchema = mongoose.Schema({
  ItemName: {
    type: String,
    required: true
  },
  Category: {
    type: String,
  },
  Description: {
    type: String,
  },
  UnitOfMeasure: {
    type: String,
  },
  QuantityInStock: {
    type: Number,
    required: true,
    default: 0
  },
  ReorderLevel: {
    type: Number,
    default: 0
  },
  ExpirationDate: {
    type: Date,
  },
  Location: {
    type: String,
  },
  SupplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', // Reference to Supplier model
  },
  CostPerUnit: {
    type: Number,
  },
  Status: {
    type: String,
    default: 'Active'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema); 