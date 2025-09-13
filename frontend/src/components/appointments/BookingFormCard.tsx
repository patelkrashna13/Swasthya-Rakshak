import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, isToday } from 'date-fns';
import { Calendar, User, Phone, Mail, Heart, Stethoscope, Users } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['M', 'F', 'Prefer not to say'];
const DISEASE_TYPES = ['ENT', 'OPD', 'Orthopaedic', 'Optics', 'Dental', 'Skin', 'Reproductive'];

// Generate time slots from 9 AM to 5 PM in 30-minute intervals
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
}).filter(time => {
  const [hours] = time.split(':').map(Number);
  return hours < 17 || (hours === 17 && time.endsWith('00'));
});

export interface AppointmentForm {
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  patientEmail: string;
  patientPhone: string;
  age: string;
  gender: string;
  mobileNo: string;
  bloodGroup: string;
  typeOfDisease: string;
  consultationType: 'video' | 'phone' | 'in-person';
  date: string;
  time: string;
  reason: string;
  symptoms: string;
}

interface BookingFormCardProps {
  onSubmit: (form: AppointmentForm) => Promise<void>;
  onCancel: () => void;
  doctorId?: string;
  doctorName?: string;
  doctorEmail?: string;
}

const BookingFormCard: React.FC<BookingFormCardProps> = ({ 
  onSubmit, 
  onCancel, 
  doctorId, 
  doctorName, 
  doctorEmail 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<AppointmentForm>({
    patientName: '',
    patientId: '',
    doctorId: doctorId || '',
    doctorName: doctorName || '',
    doctorEmail: doctorEmail || '',
    patientEmail: '',
    patientPhone: '',
    age: '',
    gender: '',
    mobileNo: '',
    bloodGroup: '',
    typeOfDisease: '',
    consultationType: 'video',
    date: '',
    time: '',
    reason: '',
    symptoms: ''
  });

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

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      setTimeout(() => {
        const bookedSlots: string[] = [];
        const slots = TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
        setAvailableSlots(slots);
        setIsLoadingSlots(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setIsLoadingSlots(false);
    }
  };

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

  const generateCalendlyLink = (data: AppointmentForm) => {
    const baseUrl = "https://calendly.com/your-clinic/consultation";
    const params = new URLSearchParams({
      name: data.patientName,
      email: data.patientEmail,
      a1: data.patientPhone || data.mobileNo,
      a2: data.consultationType,
      a3: data.symptoms || data.reason,
      a4: data.gender,
      a5: data.age,
      a6: data.bloodGroup
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const sendEmailNotification = async (data: AppointmentForm, calendlyLink: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/calendly/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone || data.mobileNo,
          appointmentDate: data.date,
          appointmentTime: data.time,
          consultationType: data.consultationType,
          symptoms: data.symptoms || data.reason,
          gender: data.gender,
          age: data.age,
          bloodGroup: data.bloodGroup,
          typeOfDisease: data.typeOfDisease,
          doctorName: data.doctorName,
          doctorSpecialty: data.typeOfDisease,
          calendlyLink
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email notification');
      }

      console.log('Email notification sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      alert('Please select a date and time for your appointment');
      return;
    }

    const requiredFields: (keyof AppointmentForm)[] = [
      'patientName', 'patientEmail', 'age', 'gender', 'mobileNo', 'bloodGroup', 'typeOfDisease', 'reason'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      
      // Generate Calendly link
      const calendlyLink = generateCalendlyLink(formData);
      
      // Send email notification with Calendly link
      await sendEmailNotification(formData, calendlyLink);
      
      // Submit the appointment data
      const appointmentData = {
        ...formData,
        calendlyLink,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      };
      
      await onSubmit(appointmentData);
      
      alert('Appointment booked successfully! A Calendly link has been sent to your email.');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep1 = () => {
    const requiredStep1Fields = ['patientName', 'patientEmail', 'mobileNo', 'age', 'gender', 'bloodGroup'];
    return requiredStep1Fields.every(field => formData[field as keyof AppointmentForm].toString().trim() !== '');
  };

  const validateStep2 = () => {
    const requiredStep2Fields = ['typeOfDisease', 'consultationType', 'reason'];
    return requiredStep2Fields.every(field => formData[field as keyof AppointmentForm].toString().trim() !== '');
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      alert('Please fill in all required fields in Step 1 before proceeding.');
      return;
    }
    if (currentStep === 2 && !validateStep2()) {
      alert('Please fill in all required fields in Step 2 before proceeding.');
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-transparent backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-200/30 dark:border-gray-700/30 mb-4"
    >
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Stethoscope className="h-5 w-5 mr-2" />
          Book New Appointment
        </h3>
        <div className="flex mt-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step ? 'bg-white text-primary-600' : 'bg-primary-400 text-white'
              }`}>
                {step}
              </div>
              {step < 3 && <div className={`w-8 h-0.5 ${currentStep > step ? 'bg-white' : 'bg-primary-400'}`} />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Step 1: Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center text-gray-700 dark:text-gray-200">
                  <User className="h-3 w-3 mr-1" />
                  Patient Name *
                </label>
                <input 
                  type="text" 
                  name="patientName" 
                  value={formData.patientName} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center text-gray-700 dark:text-gray-200">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Address *
                </label>
                <input 
                  type="email" 
                  name="patientEmail" 
                  value={formData.patientEmail} 
                  onChange={handleInputChange} 
                  required
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center text-gray-700 dark:text-gray-200">
                  <Phone className="h-3 w-3 mr-1" />
                  Phone Number *
                </label>
                <input 
                  type="tel" 
                  name="mobileNo" 
                  value={formData.mobileNo} 
                  onChange={handleInputChange} 
                  required 
                  pattern="[0-9]{10}" 
                  maxLength={10} 
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Age *</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleInputChange} 
                  required 
                  min="0" 
                  max="120"
                  placeholder="Enter your age"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center text-gray-700 dark:text-gray-200">
                  <Users className="h-3 w-3 mr-1" />
                  Gender *
                </label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200"
                >
                  <option value="" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Select Gender</option>
                  {GENDERS.map(g => (
                    <option key={g} value={g} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {g === 'M' ? 'Male' : g === 'F' ? 'Female' : 'Prefer not to say'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center text-gray-700 dark:text-gray-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Blood Group *
                </label>
                <select 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200"
                >
                  <option value="" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Select Blood Group</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medical Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Step 2: Medical Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Consultation Type *</label>
                <select 
                  name="typeOfDisease" 
                  value={formData.typeOfDisease} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200"
                >
                  <option value="" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Select Consultation Type</option>
                  {DISEASE_TYPES.map(d => (
                    <option key={d} value={d} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Appointment Type *</label>
                <select 
                  name="consultationType" 
                  value={formData.consultationType} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200"
                >
                  <option value="video" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Video Call</option>
                  <option value="phone" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">Phone Call</option>
                  <option value="in-person" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">In-Person</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Symptoms / Reason for Visit *</label>
              <textarea 
                name="reason" 
                value={formData.reason} 
                onChange={handleInputChange} 
                rows={4}
                required
                placeholder="Briefly describe your symptoms or reason for the appointment"
                className="w-full px-3 py-2 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Step 3: Date and Time Selection */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Step 3: Select Date & Time
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div className="bg-white/10 dark:bg-gray-700/10 backdrop-blur-sm p-4 rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Choose Date</h5>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="py-1 font-medium">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {availableDates.map(({ date, formattedDate, day, dateNum, isToday }) => {
                    const isSelected = formData.date === formattedDate;
                    const isWeekend = day === 'Sat' || day === 'Sun';
                    
                    return (
                      <button
                        key={formattedDate}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        disabled={isWeekend}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors
                          ${isSelected 
                            ? 'bg-primary-600 text-white' 
                            : isToday 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                              : isWeekend 
                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                        `}
                      >
                        {dateNum}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Time Selection */}
              <div className="bg-white/10 dark:bg-gray-700/10 backdrop-blur-sm p-4 rounded-lg border border-gray-200/30 dark:border-gray-600/30">
                <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Choose Time</h5>
                {!formData.date ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    Please select a date first
                  </div>
                ) : isLoadingSlots ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                          formData.time === slot
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {formData.date && formData.time && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-300">
                <p className="font-medium">Calendly Integration</p>
                <p className="mt-1">A personalized Calendly meeting link will be generated and sent to your email address after booking. You can use this link to schedule or reschedule your appointment as needed.</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
            )}
            <button 
              type="button" 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <div>
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                disabled={(currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2())}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  (currentStep === 1 && !validateStep1()) || (currentStep === 2 && !validateStep2())
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={submitting || !formData.date || !formData.time}
                className={`px-6 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  submitting || !formData.date || !formData.time
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting ? 'Booking Appointment...' : 'Book Appointment'}
              </button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingFormCard;
