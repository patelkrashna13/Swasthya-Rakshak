import React from 'react';
import { Calendar, Clock, Video, MessageSquare, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  googleMeetLink?: string;
  reason: string;
  typeOfDisease: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onJoinMeeting?: (meetingLink: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onJoinMeeting }) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No appointments scheduled yet.</p>
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
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
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
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {appointment.doctorName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.typeOfDisease}</p>
              </div>
              {getStatusBadge(appointment.status)}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-primary-600" />
                <span>{appointment.time}</span>
              </div>
            </div>

            {appointment.reason && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium">Reason:</p>
                <p>{appointment.reason}</p>
              </div>
            )}

            {appointment.googleMeetLink && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onJoinMeeting?.(appointment.googleMeetLink!)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Meeting
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(appointment.googleMeetLink!)}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Copy Link
                  </button>
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
