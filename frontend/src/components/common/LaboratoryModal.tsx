import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface LabTestForm {
  patientId: string;
  doctorId: string;
  testType: string;
  testName: string;
  orderDate: string;
  sampleCollectionDate: string;
  status: string;
  resultDate: string;
  resultSummary: string;
  diagnosticEquipmentId: string;
  remarks: string;
}

interface LaboratoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: LabTestForm) => Promise<void>;
}

export default function LaboratoryModal({ open, onClose, onSubmit }: LaboratoryModalProps) {
  const [form, setForm] = useState<LabTestForm>({
    patientId: '',
    doctorId: '',
    testType: '',
    testName: '',
    orderDate: '',
    sampleCollectionDate: '',
    status: '',
    resultDate: '',
    resultSummary: '',
    diagnosticEquipmentId: '',
    remarks: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    setForm({
      patientId: '',
      doctorId: '',
      testType: '',
      testName: '',
      orderDate: '',
      sampleCollectionDate: '',
      status: '',
      resultDate: '',
      resultSummary: '',
      diagnosticEquipmentId: '',
      remarks: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[95vw] sm:max-w-3xl relative my-6 mx-4 max-h-[90vh] overflow-y-auto no-scrollbar" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Add New Lab Test Record</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium mb-1">Patient ID</label>
                <input type="text" id="patientId" name="patientId" value={form.patientId} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium mb-1">Doctor ID</label>
                <input type="text" id="doctorId" name="doctorId" value={form.doctorId} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="testType" className="block text-sm font-medium mb-1">Test Type</label>
                <input type="text" id="testType" name="testType" value={form.testType} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="testName" className="block text-sm font-medium mb-1">Test Name</label>
                <input type="text" id="testName" name="testName" value={form.testName} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="orderDate" className="block text-sm font-medium mb-1">Order Date</label>
                <input type="date" id="orderDate" name="orderDate" value={form.orderDate} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="sampleCollectionDate" className="block text-sm font-medium mb-1">Sample Collection Date</label>
                <input type="date" id="sampleCollectionDate" name="sampleCollectionDate" value={form.sampleCollectionDate} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                 <select id="status" name="status" value={form.status} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Select Status</option>
                  <option value="Ordered">Ordered</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label htmlFor="resultDate" className="block text-sm font-medium mb-1">Result Date</label>
                <input type="date" id="resultDate" name="resultDate" value={form.resultDate} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="resultSummary" className="block text-sm font-medium mb-1">Result Summary</label>
                <textarea id="resultSummary" name="resultSummary" value={form.resultSummary} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"></textarea>
              </div>
               <div>
                <label htmlFor="diagnosticEquipmentId" className="block text-sm font-medium mb-1">Diagnostic Equipment ID (Optional)</label>
                <input type="text" id="diagnosticEquipmentId" name="diagnosticEquipmentId" value={form.diagnosticEquipmentId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="remarks" className="block text-sm font-medium mb-1">Remarks</label>
                <textarea id="remarks" name="remarks" value={form.remarks} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"></textarea>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Adding...' : 'Add Lab Record'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 