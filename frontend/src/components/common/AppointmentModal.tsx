import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isToday } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['M', 'F', 'Prefer not to say'];
const DISEASE_TYPES = ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'];

// Generate time slots from 9 AM to 5 PM in 30-minute intervals
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
}).filter(time => {
  // Filter out times after 5 PM
  const [hours] = time.split(':').map(Number);
  return hours < 17 || (hours === 17 && time.endsWith('00'));
});

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 40, transition: { duration: 0.2 } },
};

export interface AppointmentForm {
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  patientEmail: string;
  age: string;
  gender: string;
  mobileNo: string;
  bloodGroup: string;
  typeOfDisease: string;
  date: string;
  time: string;
  reason: string;
}

interface AppointmentModalProps {
  open: boolean;
  doctorId?: string;
  doctorName?: string;
  doctorEmail?: string;
  onClose: () => void;
  onSubmit: (form: AppointmentForm) => Promise<void>;
}

export default function AppointmentModal({ 
  open, 
  doctorId, 
  doctorName,
  doctorEmail,
  onClose, 
  onSubmit 
}: AppointmentModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // Initialize form data with doctor info if provided
  const [formData, setFormData] = useState<AppointmentForm>({
    patientName: '',
    patientId: '',
    doctorId: doctorId || '',
    doctorName: doctorName || '',
    doctorEmail: doctorEmail || '',
    patientEmail: '',
    age: '',
    gender: '',
    mobileNo: '',
    bloodGroup: '',
    typeOfDisease: '',
    date: '',
    time: '',
    reason: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate next 14 days for the calendar
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date,
      formattedDate: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      dateNum: format(date, 'd'),
      isToday: isToday(date)
    };
  });

  // Fetch available time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      // In a real app, you would fetch this from your backend
      // const response = await api.get(`/appointments/availability/${doctorId}?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      // setAvailableSlots(response.data.availableSlots);
      
      // Simulate API call
      setTimeout(() => {
        // Filter out already booked slots (in a real app, this would come from the backend)
        const bookedSlots: string[] = []; // This would come from your API
        const slots = TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
        setAvailableSlots(slots);
        setIsLoadingSlots(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setIsLoadingSlots(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, date: dateStr, time: '' }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.date || !formData.time) {
      alert('Please select a date and time for your appointment');
      return;
    }

    // Ensure all required fields are filled
    const requiredFields: (keyof AppointmentForm)[] = [
      'patientName', 'age', 'gender', 'mobileNo', 'bloodGroup', 'typeOfDisease', 'reason'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8" 
          initial="hidden" 
          animate="visible" 
          exit="exit" 
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-[95vw] sm:max-w-4xl relative my-8 mx-4 max-h-[90vh] overflow-y-auto no-scrollbar" 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">
              Book Appointment
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="patientName" 
                      value={formData.patientName} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Age</label>
                      <input 
                        type="number" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange} 
                        required 
                        min="0" 
                        max="120"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <select 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        <option value="">Select</option>
                        {GENDERS.map(g => (
                          <option key={g} value={g}>
                            {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Prefer not to say'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      name="mobileNo" 
                      value={formData.mobileNo} 
                      onChange={handleInputChange} 
                      required 
                      pattern="[0-9]{10}" 
                      maxLength={10} 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="patientEmail" 
                      value={formData.patientEmail} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Group</label>
                    <select 
                      name="bloodGroup" 
                      value={formData.bloodGroup} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Right Column - Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
                    Medical Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type of Consultation</label>
                    <select 
                      name="typeOfDisease" 
                      value={formData.typeOfDisease} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    >
                      <option value="">Select consultation type</option>
                      {DISEASE_TYPES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                    <textarea 
                      name="reason" 
                      value={formData.reason} 
                      onChange={handleInputChange} 
                      rows={3}
                      placeholder="Briefly describe your symptoms or reason for the appointment"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                  </div>
                </div>
              </div>
              
              {/* Date and Time Selection */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2">
                  Select Date & Time
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Calendar */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        <Calendar className="inline-block w-5 h-5 mr-2" />
                        Select Date
                      </h4>
                      {formData.date && (
                        <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                          {format(new Date(formData.date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="py-1 font-medium">{day}</div>
                      ))}
                      
                      {availableDates.map(({ date, formattedDate, day, dateNum, isToday }) => {
                        const isSelected = formData.date === formattedDate;
                        const isWeekend = day === 'Sat' || day === 'Sun';
                        
                        return (
                          <button
                            key={formattedDate}
                            type="button"
                            onClick={() => handleDateSelect(date)}
                            disabled={isWeekend}
                            className={`p-2 rounded-full text-sm font-medium transition-colors
                              ${isSelected 
                                ? 'bg-primary-600 text-white' 
                                : isToday 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                                  : isWeekend 
                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                            `}
                            aria-label={`Select ${formattedDate}`}
                          >
                            {dateNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Time Slots */}
                  <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        <Clock className="inline-block w-5 h-5 mr-2" />
                        Available Time Slots
                      </h4>
                      {formData.time ? (
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {formData.time}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Select a time</span>
                      )}
                    </div>
                    
                    {!formData.date ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Please select a date to see available time slots
                      </div>
                    ) : isLoadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No available slots for this date. Please select another date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleTimeSelect(slot)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                              formData.time === slot
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Google Meet Notice */}
              {formData.date && formData.time && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Telemedicine Appointment</p>
                      <p className="mt-1">
                        A Google Meet link will be generated and sent to your email after booking. 
                        Please join the meeting at the scheduled time.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !formData.date || !formData.time}
                  className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                    submitting || !formData.date || !formData.time
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {submitting ? 'Scheduling...' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}