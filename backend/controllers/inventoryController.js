const InventoryItem = require('../models/InventoryItem');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const PurchaseOrderItem = require('../models/PurchaseOrderItem');
const InventoryTransaction = require('../models/InventoryTransaction');
const mongoose = require('mongoose');

// @desc    Add new inventory item
// @route   POST /api/inventory/items
// @access  Public
const addInventoryItem = async (req, res) => {
  try {
    const { ItemName, Category, Description, UnitOfMeasure, QuantityInStock, ReorderLevel, ExpirationDate, Location, SupplierID, CostPerUnit, Status } = req.body;

    if (!ItemName) {
      return res.status(400).json({ message: 'Please include Item Name' });
    }

    // Validate SupplierID if provided
    if (SupplierID && !mongoose.Types.ObjectId.isValid(SupplierID)) {
      return res.status(400).json({ message: 'Invalid Supplier ID format' });
    }

    const item = await InventoryItem.create({
      ItemName,
      Category,
      Description,
      UnitOfMeasure,
      QuantityInStock: Number(QuantityInStock) || 0,
      ReorderLevel: Number(ReorderLevel) || 0,
      ExpirationDate: ExpirationDate ? new Date(ExpirationDate) : undefined,
      Location,
      SupplierID,
      CostPerUnit: Number(CostPerUnit) || 0,
      Status: Status || 'Active'
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add new supplier
// @route   POST /api/inventory/suppliers
// @access  Public
const addSupplier = async (req, res) => {
  try {
    const { SupplierName, ContactPerson, Phone, Email, Address, SupplyType } = req.body;

    if (!SupplierName) {
      return res.status(400).json({ message: 'Please include Supplier Name' });
    }

    const supplier = await Supplier.create({
      SupplierName,
      ContactPerson,
      Phone,
      Email,
      Address,
      SupplyType
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create new purchase order
// @route   POST /api/inventory/purchaseorders
// @access  Public
const createPurchaseOrder = async (req, res) => {
  try {
    const { SupplierID, OrderDate, ExpectedDeliveryDate, Status, TotalAmount } = req.body;

    if (!SupplierID || !OrderDate) {
      return res.status(400).json({ message: 'Please include Supplier ID and Order Date' });
    }

    if (!mongoose.Types.ObjectId.isValid(SupplierID)) {
      return res.status(400).json({ message: 'Invalid Supplier ID format' });
    }

    const purchaseOrder = await PurchaseOrder.create({
      SupplierID,
      OrderDate: new Date(OrderDate),
      ExpectedDeliveryDate: ExpectedDeliveryDate ? new Date(ExpectedDeliveryDate) : undefined,
      Status: Status || 'Pending',
      TotalAmount: Number(TotalAmount) || 0
    });

    res.status(201).json(purchaseOrder);
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add item to purchase order
// @route   POST /api/inventory/purchaseorderitems
// @access  Public
const addPurchaseOrderItem = async (req, res) => {
  try {
    const { PurchaseOrderID, ItemID, QuantityOrdered, QuantityReceived, UnitCost } = req.body;

    if (!PurchaseOrderID || !ItemID || !QuantityOrdered) {
      return res.status(400).json({ message: 'Please include Purchase Order ID, Item ID, and Quantity Ordered' });
    }

    if (!mongoose.Types.ObjectId.isValid(PurchaseOrderID) || !mongoose.Types.ObjectId.isValid(ItemID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const purchaseOrderItem = await PurchaseOrderItem.create({
      PurchaseOrderID,
      ItemID,
      QuantityOrdered: Number(QuantityOrdered),
      QuantityReceived: Number(QuantityReceived) || 0,
      UnitCost: Number(UnitCost) || 0
    });

    res.status(201).json(purchaseOrderItem);
  } catch (error) {
    console.error('Error adding purchase order item:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Record new inventory transaction
// @route   POST /api/inventory/transactions
// @access  Public
const addInventoryTransaction = async (req, res) => {
  try {
    const { ItemID, TransactionType, Quantity, PerformedBy, Remarks } = req.body;

    if (!ItemID || !TransactionType || !Quantity) {
      return res.status(400).json({ message: 'Please include Item ID, Transaction Type, and Quantity' });
    }

    if (!mongoose.Types.ObjectId.isValid(ItemID)) {
      return res.status(400).json({ message: 'Invalid Item ID format' });
    }

    const transaction = await InventoryTransaction.create({
      ItemID,
      TransactionType,
      Quantity: Number(Quantity),
      TransactionDate: new Date(),
      PerformedBy,
      Remarks
    });

    // Update inventory item quantity based on transaction type
    const updateOperation = TransactionType === 'Addition' ? 
      { $inc: { QuantityInStock: Number(Quantity) } } : 
      { $inc: { QuantityInStock: -Number(Quantity) } };

    await InventoryItem.findByIdAndUpdate(ItemID, updateOperation);

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error recording inventory transaction:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory/items
// @access  Public
const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find()
      .populate('SupplierID', 'SupplierName ContactPerson')
      .sort({ ItemName: 1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all suppliers
// @route   GET /api/inventory/suppliers
// @access  Public
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ SupplierName: 1 });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all purchase orders
// @route   GET /api/inventory/purchaseorders
// @access  Public
const getPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('SupplierID', 'SupplierName ContactPerson')
      .sort({ OrderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all purchase order items
// @route   GET /api/inventory/purchaseorderitems
// @access  Public
const getPurchaseOrderItems = async (req, res) => {
  try {
    const items = await PurchaseOrderItem.find()
      .populate('PurchaseOrderID', 'OrderDate Status')
      .populate('ItemID', 'ItemName UnitOfMeasure')
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching purchase order items:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all inventory transactions
// @route   GET /api/inventory/transactions
// @access  Public
const getInventoryTransactions = async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find()
      .populate('ItemID', 'ItemName UnitOfMeasure')
      .populate('PerformedBy', 'name')
      .sort({ TransactionDate: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching inventory transactions:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
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
}; 