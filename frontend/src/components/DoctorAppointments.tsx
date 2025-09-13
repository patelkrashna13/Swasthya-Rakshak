import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Video, AlertCircle, Stethoscope, Heart, Users, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'video' | 'phone' | 'in-person';
  symptoms: string;
  calendlyLink: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  updatedAt: string;
}

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/calendly/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.success) {
        setAppointments(data.data);
      } else {
        setError(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError('Network error while fetching appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'no-show': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'phone': return <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'in-person': return <User className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default: return <Video className="w-4 h-4 text-green-600 dark:text-green-400" />;
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      setDeletingId(appointmentId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/calendly/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete appointment');
      }
        } catch (err) {
      console.error('Error deleting appointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      alert(`Failed to delete appointment: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full text-center border border-red-300 dark:border-red-800">
                    <div className="bg-red-100 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Appointments</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchAppointments}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-600 p-3 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Patient Appointments
                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage and view all your medical appointments
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={fetchAppointments}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {appointments.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
                        className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
                        <div className="bg-gray-100 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-orange-400" />
            </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No appointments found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Your appointment history will appear here</p>
          </motion.div>
        ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment: Appointment, index: number) => (
              <motion.div 
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                {/* Card Header */}
                <div className="bg-orange-600 p-4 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-orange-100 text-sm">{appointment.doctorName} - {appointment.doctorSpecialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-white/20 text-white">
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDeleteAppointment(appointment._id)}
                        disabled={deletingId === appointment._id}
                        className="p-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete appointment"
                      >
                        {deletingId === appointment._id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                                <div className="p-4 bg-white dark:bg-gray-800">
                  {/* Main Info Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{appointment.appointmentDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{appointment.appointmentTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getConsultationIcon(appointment.consultationType)}
                      <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                                                <p className="text-sm text-gray-900 dark:text-white capitalize">{appointment.consultationType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{appointment.patientPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                                    <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-sm text-gray-900 dark:text-white">{appointment.patientEmail}</p>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {appointment.symptoms && (
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-4 h-4 text-red-400" />
                                                <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Symptoms</span>
                      </div>
                                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                                                <p className="text-sm text-red-700 dark:text-gray-300">{appointment.symptoms}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Booked:</span> {new Date(appointment.createdAt).toLocaleDateString()}
                    </div>
                    <a
                      href={appointment.calendlyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-600 p-2 rounded">
              <Users className="w-5 h-5 text-white" />
            </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointment Statistics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-orange-400 mb-1">{appointments.length}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Total Appointments</div>
            </div>
                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {appointments.filter(apt => apt.status === 'scheduled').length}
              </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Scheduled</div>
            </div>
                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="text-2xl font-bold text-orange-500 mb-1">
                {appointments.filter(apt => apt.consultationType === 'video').length}
              </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Video Calls</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
