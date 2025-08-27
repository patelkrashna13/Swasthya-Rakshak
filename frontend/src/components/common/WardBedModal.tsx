import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WardForm {
  WardName: string;
  Type: string;
  Capacity: number;
  CurrentOccupancy: number;
  Location: string;
  Status: string;
}

interface BedForm {
  WardID: string; // Will likely need to fetch Ward options
  BedNumber: string;
  Status: string;
}

interface PatientAssignmentForm {
  PatientID: string; // Will likely need to fetch Patient options
  WardID: string; // Will likely need to fetch Ward options
  BedID: string; // Will likely need to fetch Bed options
  AdmitDate: string; // Consider using a date picker
  Status: string;
}

interface WardBedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitWard: (form: WardForm) => void;
  onSubmitBed: (form: BedForm) => void;
  onSubmitPatientAssignment: (form: PatientAssignmentForm) => void;
}

const WardBedModal: React.FC<WardBedModalProps> = ({ open, onClose, onSubmitWard, onSubmitBed, onSubmitPatientAssignment }) => {
  const [activeTab, setActiveTab] = useState('ward'); // 'ward', 'bed', 'assignment'
  const [wardForm, setWardForm] = useState<WardForm>({
    WardName: '',
    Type: '',
    Capacity: 0,
    CurrentOccupancy: 0,
    Location: '',
    Status: 'Active',
  });
  const [bedForm, setBedForm] = useState<BedForm>({
    WardID: '',
    BedNumber: '',
    Status: 'Available',
  });
  const [patientAssignmentForm, setPatientAssignmentForm] = useState<PatientAssignmentForm>({
    PatientID: '',
    WardID: '',
    BedID: '',
    AdmitDate: '',
    Status: 'Admitted',
  });

  const handleWardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWardForm({ ...wardForm, [name]: name === 'Capacity' || name === 'CurrentOccupancy' ? Number(value) : value });
  };

  const handleBedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBedForm({ ...bedForm, [name]: value });
  };

  const handlePatientAssignmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientAssignmentForm({ ...patientAssignmentForm, [name]: value });
  };

  const handleSubmitWard = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitWard(wardForm);
    // Reset form or close modal on success
  };

  const handleSubmitBed = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitBed(bedForm);
    // Reset form or close modal on success
  };

   const handleSubmitPatientAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPatientAssignment(patientAssignmentForm);
    // Reset form or close modal on success
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto py-6"
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">Ward & Bed Management</h2>
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 rounded-l-md ${activeTab === 'ward' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('ward')}
              >
                Add Ward
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'bed' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('bed')}
              >
                Add Bed
              </button>
              <button
                className={`px-4 py-2 rounded-r-md ${activeTab === 'assignment' ? 'bg-secondary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setActiveTab('assignment')}
              >
                Assign Patient
              </button>
            </div>

            {activeTab === 'ward' && (
              <form onSubmit={handleSubmitWard} className="space-y-4">
                <div>
                  <label htmlFor="WardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ward Name</label>
                  <input type="text" name="WardName" id="WardName" value={wardForm.WardName} onChange={handleWardChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="Type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <input type="text" name="Type" id="Type" value={wardForm.Type} onChange={handleWardChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="Capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                  <input type="number" name="Capacity" id="Capacity" value={wardForm.Capacity} onChange={handleWardChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="Location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input type="text" name="Location" id="Location" value={wardForm.Location} onChange={handleWardChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="Status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                   <select id="Status" name="Status" value={wardForm.Status} onChange={handleWardChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Add Ward</button>
              </form>
            )}

            {activeTab === 'bed' && (
              <form onSubmit={handleSubmitBed} className="space-y-4">
                <div>
                  <label htmlFor="WardID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ward</label>
                  {/* This should ideally be a dropdown populated with fetched wards */}
                  <input type="text" name="WardID" id="WardID" value={bedForm.WardID} onChange={handleBedChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="BedNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bed Number</label>
                  <input type="text" name="BedNumber" id="BedNumber" value={bedForm.BedNumber} onChange={handleBedChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="Status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                   <select id="Status" name="Status" value={bedForm.Status} onChange={handleBedChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                     <option value="Cleaning">Cleaning</option>
                     <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Add Bed</button>
              </form>
            )}

            {activeTab === 'assignment' && (
              <form onSubmit={handleSubmitPatientAssignment} className="space-y-4">
                <div>
                  <label htmlFor="PatientID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient</label>
                   {/* This should ideally be a dropdown populated with fetched patients */}
                  <input type="text" name="PatientID" id="PatientID" value={patientAssignmentForm.PatientID} onChange={handlePatientAssignmentChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="WardID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ward</label>
                   {/* This should ideally be a dropdown populated with fetched wards */}
                  <input type="text" name="WardID" id="WardID" value={patientAssignmentForm.WardID} onChange={handlePatientAssignmentChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="BedID" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bed</label>
                   {/* This should ideally be a dropdown populated with fetched beds based on selected ward */}
                  <input type="text" name="BedID" id="BedID" value={patientAssignmentForm.BedID} onChange={handlePatientAssignmentChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                <div>
                  <label htmlFor="AdmitDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admit Date</label>
                  <input type="date" name="AdmitDate" id="AdmitDate" value={patientAssignmentForm.AdmitDate} onChange={handlePatientAssignmentChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                </div>
                 <div>
                  <label htmlFor="Status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                   <select id="Status" name="Status" value={patientAssignmentForm.Status} onChange={handlePatientAssignmentChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="Admitted">Admitted</option>
                    <option value="Discharged">Discharged</option>
                     <option value="Transferred">Transferred</option>
                  </select>
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Assign Patient to Bed</button>
              </form>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WardBedModal;
export type { WardForm, BedForm, PatientAssignmentForm }; 