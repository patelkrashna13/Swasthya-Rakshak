import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryItemForm {
  ItemName: string;
  Category: string;
  Description: string;
  UnitOfMeasure: string;
  QuantityInStock: number;
  ReorderLevel: number;
  ExpirationDate?: string; // Optional, use string for date input value
  Location: string;
  SupplierID?: string; // Optional, will need options from fetched suppliers
  CostPerUnit?: number;
  Status: string;
}

interface SupplierForm {
  SupplierName: string;
  ContactPerson: string;
  Phone: string;
  Email: string;
  Address: string;
  SupplyType: string;
}

interface PurchaseOrderForm {
  SupplierID: string; // Will need options from fetched suppliers
  OrderedBy?: string; // Optional, will need options from fetched staff
  ExpectedDeliveryDate?: string; // Optional, use string for date input value
}

interface PurchaseOrderItemForm {
  PurchaseOrderID: string; // Will need options from fetched purchase orders
  ItemID: string; // Will need options from fetched inventory items
  QuantityOrdered: number;
  UnitCost?: number;
}

interface InventoryTransactionForm {
  ItemID: string; // Will need options from fetched inventory items
  TransactionType: 'Addition' | 'Removal' | 'Adjustment' | 'Expiry';
  Quantity: number;
  PerformedBy?: string; // Optional, will need options from fetched staff
  Remarks?: string;
}

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitItem: (form: InventoryItemForm) => void;
  onSubmitSupplier: (form: SupplierForm) => void;
  onSubmitPurchaseOrder: (form: PurchaseOrderForm) => void;
  onSubmitPurchaseOrderItem: (form: PurchaseOrderItemForm) => void;
  onSubmitInventoryTransaction: (form: InventoryTransactionForm) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  open,
  onClose,
  onSubmitItem,
  onSubmitSupplier,
  onSubmitPurchaseOrder,
  onSubmitPurchaseOrderItem,
  onSubmitInventoryTransaction,
}) => {
  const [activeTab, setActiveTab] = useState('item'); // 'item', 'supplier', 'purchaseOrder', 'purchaseOrderItem', 'transaction'
  const [itemForm, setItemForm] = useState<InventoryItemForm>({
    ItemName: '',
    Category: '',
    Description: '',
    UnitOfMeasure: '',
    QuantityInStock: 0,
    ReorderLevel: 0,
    Location: '',
    Status: 'Active',
  });
  const [supplierForm, setSupplierForm] = useState<SupplierForm>({
    SupplierName: '',
    ContactPerson: '',
    Phone: '',
    Email: '',
    Address: '',
    SupplyType: '',
  });
  const [purchaseOrderForm, setPurchaseOrderForm] = useState<PurchaseOrderForm>({
    SupplierID: '',
  });
  const [purchaseOrderItemForm, setPurchaseOrderItemForm] = useState<PurchaseOrderItemForm>({
    PurchaseOrderID: '',
    ItemID: '',
    QuantityOrdered: 0,
  });
  const [inventoryTransactionForm, setInventoryTransactionForm] = useState<InventoryTransactionForm>({
    ItemID: '',
    TransactionType: 'Addition',
    Quantity: 0,
  });

  // Handlers for form input changes
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: name === 'QuantityInStock' || name === 'ReorderLevel' || name === 'CostPerUnit' ? Number(value) : value });
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupplierForm({ ...supplierForm, [name]: value });
  };

  const handlePurchaseOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPurchaseOrderForm({ ...purchaseOrderForm, [name]: value });
  };

  const handlePurchaseOrderItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPurchaseOrderItemForm({ ...purchaseOrderItemForm, [name]: name === 'QuantityOrdered' || name === 'UnitCost' ? Number(value) : value });
  };

  const handleInventoryTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInventoryTransactionForm({ ...inventoryTransactionForm, [name]: name === 'Quantity' ? Number(value) : value });
  };

  // Handlers for form submissions
  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitItem(itemForm);
    // Consider resetting form or closing modal on success in parent
  };

  const handleSubmitSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSupplier(supplierForm);
    // Consider resetting form or closing modal on success in parent
  };

  const handleSubmitPurchaseOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPurchaseOrder(purchaseOrderForm);
    // Consider resetting form or closing modal on success in parent
  };

  const handleSubmitPurchaseOrderItem = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPurchaseOrderItem(purchaseOrderItemForm);
    // Consider resetting form or closing modal on success in parent
  };

  const handleSubmitInventoryTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInventoryTransaction(inventoryTransactionForm);
    // Consider resetting form or closing modal on success in parent
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md md:max-w-lg lg:max-w-xl z-50 overflow-y-auto max-h-[90vh] no-scrollbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Inventory Management</h2>
            <div className="flex justify-center mb-6 overflow-x-auto">
              <button
                className={`px-3 py-2 rounded-l-md text-sm ${activeTab === 'item' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('item')}
              >
                Item
              </button>
              <button
                className={`px-3 py-2 text-sm ${activeTab === 'supplier' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('supplier')}
              >
                Supplier
              </button>
              <button
                className={`px-3 py-2 text-sm ${activeTab === 'purchaseOrder' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('purchaseOrder')}
              >
                Purchase Order
              </button>
               <button
                className={`px-3 py-2 text-sm ${activeTab === 'purchaseOrderItem' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('purchaseOrderItem')}
              >
                PO Item
              </button>
               <button
                className={`px-3 py-2 rounded-r-md text-sm ${activeTab === 'transaction' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('transaction')}
              >
                Transaction
              </button>
            </div>

            {/* Inventory Item Form */}
            {activeTab === 'item' && (
              <form onSubmit={handleSubmitItem} className="space-y-4">
                <div>
                  <label htmlFor="ItemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                  <input type="text" name="ItemName" id="ItemName" value={itemForm.ItemName} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="Category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <input type="text" name="Category" id="Category" value={itemForm.Category} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="Description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea name="Description" id="Description" value={itemForm.Description} onChange={handleItemChange as any} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                 <div>
                  <label htmlFor="UnitOfMeasure" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measure</label>
                  <input type="text" name="UnitOfMeasure" id="UnitOfMeasure" value={itemForm.UnitOfMeasure} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="QuantityInStock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity In Stock</label>
                  <input type="number" name="QuantityInStock" id="QuantityInStock" value={itemForm.QuantityInStock} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="ReorderLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reorder Level</label>
                  <input type="number" name="ReorderLevel" id="ReorderLevel" value={itemForm.ReorderLevel} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="ExpirationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiration Date</label>
                  <input type="date" name="ExpirationDate" id="ExpirationDate" value={itemForm.ExpirationDate} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="Location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input type="text" name="Location" id="Location" value={itemForm.Location} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="SupplierID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                  {/* This should be a dropdown with fetched suppliers */}
                  <input type="text" name="SupplierID" id="SupplierID" value={itemForm.SupplierID} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="CostPerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost Per Unit</label>
                  <input type="number" name="CostPerUnit" id="CostPerUnit" value={itemForm.CostPerUnit} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="Status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                   <select id="Status" name="Status" value={itemForm.Status} onChange={handleItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Add Inventory Item</button>
              </form>
            )}

            {/* Supplier Form */}
            {activeTab === 'supplier' && (
              <form onSubmit={handleSubmitSupplier} className="space-y-4">
                <div>
                  <label htmlFor="SupplierName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Name</label>
                  <input type="text" name="SupplierName" id="SupplierName" value={supplierForm.SupplierName} onChange={handleSupplierChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="ContactPerson" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                  <input type="text" name="ContactPerson" id="ContactPerson" value={supplierForm.ContactPerson} onChange={handleSupplierChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input type="text" name="Phone" id="Phone" value={supplierForm.Phone} onChange={handleSupplierChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="Email" id="Email" value={supplierForm.Email} onChange={handleSupplierChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="Address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <textarea name="Address" id="Address" value={supplierForm.Address} onChange={handleSupplierChange as any} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                 <div>
                  <label htmlFor="SupplyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supply Type</label>
                  <input type="text" name="SupplyType" id="SupplyType" value={supplierForm.SupplyType} onChange={handleSupplierChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Add Supplier</button>
              </form>
            )}

            {/* Purchase Order Form */}
            {activeTab === 'purchaseOrder' && (
              <form onSubmit={handleSubmitPurchaseOrder} className="space-y-4">
                 <div>
                  <label htmlFor="SupplierID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                  {/* This should be a dropdown with fetched suppliers */}
                  <input type="text" name="SupplierID" id="SupplierID" value={purchaseOrderForm.SupplierID} onChange={handlePurchaseOrderChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="OrderedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordered By</label>
                  {/* This should be a dropdown with fetched staff */}
                  <input type="text" name="OrderedBy" id="OrderedBy" value={purchaseOrderForm.OrderedBy} onChange={handlePurchaseOrderChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="ExpectedDeliveryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery Date</label>
                  <input type="date" name="ExpectedDeliveryDate" id="ExpectedDeliveryDate" value={purchaseOrderForm.ExpectedDeliveryDate} onChange={handlePurchaseOrderChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Create Purchase Order</button>
              </form>
            )}

            {/* Purchase Order Item Form */}
             {activeTab === 'purchaseOrderItem' && (
              <form onSubmit={handleSubmitPurchaseOrderItem} className="space-y-4">
                <div>
                  <label htmlFor="PurchaseOrderID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Order</label>
                  {/* This should be a dropdown with fetched purchase orders */}
                  <input type="text" name="PurchaseOrderID" id="PurchaseOrderID" value={purchaseOrderItemForm.PurchaseOrderID} onChange={handlePurchaseOrderItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="ItemID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inventory Item</label>
                  {/* This should be a dropdown with fetched inventory items */}
                  <input type="text" name="ItemID" id="ItemID" value={purchaseOrderItemForm.ItemID} onChange={handlePurchaseOrderItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="QuantityOrdered" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity Ordered</label>
                  <input type="number" name="QuantityOrdered" id="QuantityOrdered" value={purchaseOrderItemForm.QuantityOrdered} onChange={handlePurchaseOrderItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="UnitCost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Cost</label>
                  <input type="number" name="UnitCost" id="UnitCost" value={purchaseOrderItemForm.UnitCost} onChange={handlePurchaseOrderItemChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Add PO Item</button>
              </form>
            )}

            {/* Inventory Transaction Form */}
             {activeTab === 'transaction' && (
              <form onSubmit={handleSubmitInventoryTransaction} className="space-y-4">
                 <div>
                  <label htmlFor="ItemID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inventory Item</label>
                  {/* This should be a dropdown with fetched inventory items */}
                  <input type="text" name="ItemID" id="ItemID" value={inventoryTransactionForm.ItemID} onChange={handleInventoryTransactionChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="TransactionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
                  <select id="TransactionType" name="TransactionType" value={inventoryTransactionForm.TransactionType} onChange={handleInventoryTransactionChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    <option value="Addition">Addition</option>
                    <option value="Removal">Removal</option>
                    <option value="Adjustment">Adjustment</option>
                    <option value="Expiry">Expiry</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="Quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                  <input type="number" name="Quantity" id="Quantity" value={inventoryTransactionForm.Quantity} onChange={handleInventoryTransactionChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="PerformedBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Performed By</label>
                   {/* This should be a dropdown with fetched staff */}
                  <input type="text" name="PerformedBy" id="PerformedBy" value={inventoryTransactionForm.PerformedBy} onChange={handleInventoryTransactionChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                 <div>
                  <label htmlFor="Remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
                  <textarea name="Remarks" id="Remarks" value={inventoryTransactionForm.Remarks} onChange={handleInventoryTransactionChange as any} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Record Transaction</button>
              </form>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InventoryModal;
export type { InventoryItemForm, SupplierForm, PurchaseOrderForm, PurchaseOrderItemForm, InventoryTransactionForm }; 