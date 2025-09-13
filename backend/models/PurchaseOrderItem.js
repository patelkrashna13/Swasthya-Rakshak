const mongoose = require('mongoose');

const purchaseOrderItemSchema = mongoose.Schema({
  PurchaseOrderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
    required: true
  },
  ItemID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  QuantityOrdered: {
    type: Number,
    required: true
  },
  QuantityReceived: {
    type: Number,
    default: 0
  },
  UnitCost: {
    type: Number,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('PurchaseOrderItem', purchaseOrderItemSchema); 