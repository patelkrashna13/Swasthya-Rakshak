import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface PatientForm {
  patientName: string;
  age: string;
  gender: string;
  contact: string;
}

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: PatientForm) => Promise<void>;
}

export default function PatientModal({ open, onClose, onSubmit }: PatientModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<PatientForm>({
    patientName: '',
    age: '',
    gender: '',
    contact: '',
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
    setForm({ patientName: '', age: '', gender: '', contact: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-3 w-full max-w-[95vw] sm:max-w-md relative m-auto no-scrollbar"
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            variants={modalVariants}
            style={{
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
            <h2 className="text-lg font-bold mb-2 text-center text-primary-700 dark:text-primary-300">{t('patient.addPatient')}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-1.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{t('patient.patientName')}</label>
                <input 
                  type="text" 
                  name="patientName" 
                  value={form.patientName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent h-8" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{t('patient.dateOfBirth')}</label>
                <input 
                  type="number" 
                  name="age" 
                  value={form.age} 
                  onChange={handleChange} 
                  required 
                  min="0" 
                  className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent h-8" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{t('patient.gender')}</label>
                <select 
                  name="gender" 
                  value={form.gender} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent h-8"
                >
                  <option value="">{t('common.select')}</option>
                  <option value="M">{t('patient.male')}</option>
                  <option value="F">{t('patient.female')}</option>
                  <option value="Other">{t('patient.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">{t('patient.phone')}</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={form.contact} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent h-8" 
                />
              </div>
              <div className="pt-1">
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full py-1.5 text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 h-8"
                >
                  {submitting ? t('common.loading') : t('patient.addPatient')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 