import React from 'react';
import { Calendar, Clock, User, Phone, Mail, Video, MapPin, Heart, Stethoscope, Eye, Users, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  _id: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  mobileNo?: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
  doctorName: string;
  doctorEmail?: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  googleMeetLink?: string;
  calendlyLink?: string;
  reason: string;
  symptoms?: string;
  typeOfDisease: string;
  consultationType?: 'video' | 'phone' | 'in-person';
  createdAt?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onJoinMeeting?: (meetingLink: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onJoinMeeting }) => {
  const navigate = useNavigate();

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <button
            onClick={() => navigate('/doctor-appointments')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Eye className="h-5 w-5 mr-2" />
            View All Appointments
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <motion.div
          key={appointment._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Dr. {appointment.doctorName}
                </h3>
                <p className="text-primary-100 text-sm">{appointment.typeOfDisease} Consultation</p>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
          </div>

          <div className="p-6">
            {/* Patient Information Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-primary-600" />
                Patient Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <User className="h-3 w-3 mr-2 text-gray-400" />
                  <span className="font-medium mr-1">Name:</span>
                  <span>{appointment.patientName}</span>
                </div>
                {appointment.patientEmail && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Mail className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Email:</span>
                    <span className="truncate">{appointment.patientEmail}</span>
                  </div>
                )}
                {(appointment.patientPhone || appointment.mobileNo) && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Phone:</span>
                    <span>{appointment.patientPhone || appointment.mobileNo}</span>
                  </div>
                )}
                {appointment.age && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Age:</span>
                    <span>{appointment.age} years</span>
                  </div>
                )}
                {appointment.gender && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Gender:</span>
                    <span>{appointment.gender === 'M' ? 'Male' : appointment.gender === 'F' ? 'Female' : appointment.gender}</span>
                  </div>
                )}
                {appointment.bloodGroup && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Heart className="h-3 w-3 mr-2 text-red-500" />
                    <span className="font-medium mr-1">Blood Group:</span>
                    <span>{appointment.bloodGroup}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                Appointment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-3 w-3 mr-2 text-primary-500" />
                  <span className="font-medium mr-1">Date:</span>
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock className="h-3 w-3 mr-2 text-primary-500" />
                  <span className="font-medium mr-1">Time:</span>
                  <span>{appointment.time}</span>
                </div>
                {appointment.consultationType && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <MapPin className="h-3 w-3 mr-2 text-primary-500" />
                    <span className="font-medium mr-1">Type:</span>
                    <span className="capitalize">{appointment.consultationType.replace('-', ' ')}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Stethoscope className="h-3 w-3 mr-2 text-primary-500" />
                  <span className="font-medium mr-1">Specialty:</span>
                  <span>{appointment.typeOfDisease}</span>
                </div>
                {appointment.createdAt && (
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-medium mr-1">Booked:</span>
                    <span>{new Date(appointment.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information Section */}
            {(appointment.reason || appointment.symptoms) && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Medical Information
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="font-medium mb-2">Symptoms / Reason for Visit:</p>
                    <p className="leading-relaxed">{appointment.symptoms || appointment.reason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Links Section */}
            {(appointment.googleMeetLink || appointment.calendlyLink) && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <Video className="h-4 w-4 mr-2 text-blue-600" />
                  Meeting Links
                </h4>
                <div className="flex flex-wrap gap-3">
                  {appointment.googleMeetLink && (
                    <>
                      <button
                        onClick={() => onJoinMeeting?.(appointment.googleMeetLink!)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Google Meet
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(appointment.googleMeetLink!)}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white shadow-sm"
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Copy Google Meet Link
                      </button>
                    </>
                  )}
                  {appointment.calendlyLink && (
                    <>
                      <button
                        onClick={() => window.open(appointment.calendlyLink, '_blank')}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Open Calendly
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(appointment.calendlyLink!)}
                        className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 text-sm font-medium rounded-lg transition-colors dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-100 shadow-sm"
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Copy Calendly Link
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AppointmentList;
