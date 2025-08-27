import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface StaffForm {
  name: string;
  age: string;
  gender: string;
  role: string;
  department: string;
  qualification: string;
  experience: string;
  mobileNo: string;
  email: string;
  schedule: string;
  employmentStatus: string;
}

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: StaffForm) => Promise<void>;
}

export default function StaffModal({ open, onClose, onSubmit }: StaffModalProps) {
  const [form, setForm] = useState<StaffForm>({
    name: '',
    age: '',
    gender: '',
    role: '',
    department: '',
    qualification: '',
    experience: '',
    mobileNo: '',
    email: '',
    schedule: '',
    employmentStatus: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
    setForm({
      name: '',
      age: '',
      gender: '',
      role: '',
      department: '',
      qualification: '',
      experience: '',
      mobileNo: '',
      email: '',
      schedule: '',
      employmentStatus: '',
    });
    onClose();
    // In a real application, you would also want to refetch the staff list here
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[95vw] sm:max-w-2xl relative my-6 mx-4 max-h-[90vh] overflow-y-auto no-scrollbar" initial="hidden" animate="visible" exit="exit" variants={modalVariants}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Add New Staff Member</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
                <input type="number" id="age" name="age" value={form.age} onChange={handleChange} required min="0" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
                <select id="gender" name="gender" value={form.gender} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">Role/Designation</label>
                <input type="text" id="role" name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1">Department</label>
                <input type="text" id="department" name="department" value={form.department} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="qualification" className="block text-sm font-medium mb-1">Qualification</label>
                <input type="text" id="qualification" name="qualification" value={form.qualification} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium mb-1">Experience</label>
                <input type="text" id="experience" name="experience" value={form.experience} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="mobileNo" className="block text-sm font-medium mb-1">Mobile No.</label>
                <input type="tel" id="mobileNo" name="mobileNo" value={form.mobileNo} onChange={handleChange} required pattern="[0-9]{10}" maxLength={10} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email ID</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium mb-1">Schedule/Shift</label>
                <input type="text" id="schedule" name="schedule" value={form.schedule} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
               <div>
                <label htmlFor="employmentStatus" className="block text-sm font-medium mb-1">Employment Status</label>
                <select id="employmentStatus" name="employmentStatus" value={form.employmentStatus} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={submitting} className="w-full py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Adding...' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 