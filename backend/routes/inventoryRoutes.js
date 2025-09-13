const express = require('express');
const router = express.Router();
const { 
  addInventoryItem, 
  addSupplier, 
  createPurchaseOrder, 
  addPurchaseOrderItem, 
  addInventoryTransaction,
  getInventoryItems,
  getSuppliers,
  getPurchaseOrders,
  getPurchaseOrderItems,
  getInventoryTransactions
} = require('../controllers/inventoryController');

// Routes for Inventory Items
router.get('/items', getInventoryItems);
router.post('/items', addInventoryItem);
// Add routes for fetching, updating, deleting items as needed

// Routes for Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', addSupplier);
// Add routes for fetching, updating, deleting suppliers as needed

// Routes for Purchase Orders
router.get('/purchaseorders', getPurchaseOrders);
router.post('/purchaseorders', createPurchaseOrder);
// Add routes for fetching, updating, deleting purchase orders as needed

// Routes for Purchase Order Items
router.get('/purchaseorderitems', getPurchaseOrderItems);
router.post('/purchaseorderitems', addPurchaseOrderItem);
// Add routes for fetching, updating, deleting purchase order items as needed

// Routes for Inventory Transactions
router.get('/transactions', getInventoryTransactions);
router.post('/transactions', addInventoryTransaction);
// Add routes for fetching, updating, deleting transactions as needed

module.exports = router; 