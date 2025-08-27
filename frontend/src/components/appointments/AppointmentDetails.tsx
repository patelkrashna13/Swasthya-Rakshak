import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Video, MapPin, User } from 'lucide-react';

interface AppointmentDetailsProps {
  appointment: {
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
  };
  onCancel?: (id: string) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment, onCancel }) => {
  const appointmentDate = new Date(appointment.date);
  const isUpcoming = appointment.status === 'scheduled';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';

  const handleJoinMeeting = () => {
    if (appointment.meetingLink) {
      window.open(appointment.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {appointment.typeOfDisease} Consultation
          </h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isUpcoming ? 'bg-yellow-100 text-yellow-800' : 
            isCompleted ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {isUpcoming ? 'Upcoming' : isCompleted ? 'Completed' : 'Cancelled'}
          </span>
        </div>
        <p className="text-primary-100 text-sm mt-1">
          Appointment ID: {appointment._id.substring(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Doctor and Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Doctor</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Dr. {appointment.doctorName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {appointment.typeOfDisease} Specialist
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200">Patient</h3>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {appointment.patientName}
            </p>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            Appointment Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-gray-900 dark:text-white">
                  {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
                <p className="text-gray-900 dark:text-white">
                  {appointment.time}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-900 dark:text-white">
                  Telemedicine Appointment
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  A Google Meet link will be used for this consultation
                </p>
              </div>
            </div>
            
            {appointment.reason && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Reason for Visit
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {appointment.reason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Google Meet Section */}
        {isUpcoming && appointment.meetingLink && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-lg mr-3">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  Video Consultation Ready
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Your telemedicine appointment is scheduled. Join the meeting at the scheduled time using the button below.
                </p>
                <div className="mt-4 space-x-3">
                  <button
                    onClick={handleJoinMeeting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Video Call
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(appointment.meetingLink || '');
                        alert('Meeting link copied to clipboard!');
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Copy Meeting Link
                  </button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Meeting ID: {appointment.meetingId || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
          {isUpcoming && onCancel && (
            <button
              onClick={() => onCancel(appointment._id)}
              className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-800 dark:border-red-700 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Cancel Appointment
            </button>
          )}
          
          {isUpcoming && (
            <button
              onClick={handleAddToCalendar}
                a.href = url;
                a.download = `appointment-${appointment._id}.ics`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Add to Calendar
            </button>
          )}
          
          {isUpcoming && appointment.meetingLink && (
            <button
              onClick={handleJoinMeeting}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center justify-center"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Meeting Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
