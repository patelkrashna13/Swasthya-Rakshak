import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Video, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AppointmentDetails from '../../components/appointments/AppointmentDetails';
import AppointmentModal from '../../components/common/AppointmentModal';
import api from '../../services/api';

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  typeOfDisease: string;
  reason?: string;
  meetingLink?: string;
  meetingId?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{
    _id: string;
    name: string;
    email: string;
    specialization?: string;
  } | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch doctors list for booking new appointments
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/users/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    if (user) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [user]);

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        setAppointments(prev => 
          prev.map(apt => 
            apt._id === appointmentId 
              ? { ...apt, status: 'cancelled' as const } 
              : apt
          )
        );
      } catch (err) {
        console.error('Error cancelling appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const handleSubmitAppointment = async (formData: any) => {
    try {
      const response = await api.post('/appointments', {
        ...formData,
        doctorId: selectedDoctor?._id,
        doctorName: selectedDoctor?.name,
        doctorEmail: selectedDoctor?.email,
        patientId: user?._id,
        patientName: user?.name,
        patientEmail: user?.email,
      });
      
      setAppointments(prev => [response.data, ...prev]);
      setShowModal(false);
      setSelectedDoctor(null);
      
      // Show success message or redirect
      alert('Appointment booked successfully!');
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert('Failed to book appointment. Please try again.');
    }
  };

  // Filter appointments by status
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateA - dateB;
    });

  const pastAppointments = appointments
    .filter(apt => apt.status !== 'scheduled')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your upcoming and past medical appointments
          </p>
        </div>
        
        {doctors.length > 0 && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book New Appointment
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Appointments</h2>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {upcomingAppointments.length} {upcomingAppointments.length === 1 ? 'appointment' : 'appointments'}
          </span>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <AppointmentDetails 
                    appointment={appointment} 
                    onCancel={handleCancelAppointment} 
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming appointments</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by booking a new appointment.
            </p>
            {doctors.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Past Appointments</h2>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {pastAppointments.length} {pastAppointments.length === 1 ? 'appointment' : 'appointments'}
            </span>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {pastAppointments.map((appointment) => (
                <li key={appointment._id} className="opacity-70 hover:opacity-100 transition-opacity">
                  <AppointmentDetails 
                    appointment={appointment} 
                    onCancel={undefined} 
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <AppointmentModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedDoctor(null);
        }}
        doctorId={selectedDoctor?._id || ''}
        doctorName={selectedDoctor?.name || ''}
        doctorEmail={selectedDoctor?.email || ''}
        onSubmit={handleSubmitAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
