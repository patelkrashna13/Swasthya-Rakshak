const express = require('express');
const router = express.Router();
const { sendCalendlyAppointmentNotification } = require('../services/emailService');
const CalendlyAppointment = require('../models/CalendlyAppointment');

/**
 * POST /api/calendly/book-appointment
 * Book a Calendly appointment and send email notifications
 */
router.post('/book-appointment', async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      doctorName,
      doctorSpecialty,
      calendlyLink
    } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientName, patientEmail, patientPhone, appointmentDate, appointmentTime'
      });
    }

    // Send email notification to patient
    await sendCalendlyAppointmentNotification({
      to: patientEmail,
      patientName,
      patientEmail,
      patientPhone,
      doctorName: doctorName || 'Dr. Smith',
      doctorSpecialty: doctorSpecialty || 'General Medicine',
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'video',
      symptoms: symptoms || '',
      calendlyLink: calendlyLink || `https://calendly.com/your-clinic/consultation`
    });

    // Send notification to doctor (assuming doctor email)
    const doctorEmail = 'patelkrashna2@gmail.com'; // You can make this dynamic
    await sendCalendlyAppointmentNotification({
      to: doctorEmail,
      patientName,
      patientEmail,
      patientPhone,
      doctorName: doctorName || 'Dr. Smith',
      doctorSpecialty: doctorSpecialty || 'General Medicine',
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'video',
      symptoms: symptoms || '',
      calendlyLink: calendlyLink || `https://calendly.com/your-clinic/consultation`
    });

    // Save appointment to database
    const appointmentRecord = new CalendlyAppointment({
      patientName,
      patientEmail,
      patientPhone,
      doctorName: doctorName || 'Dr. Smith',
      doctorSpecialty: doctorSpecialty || 'General Medicine',
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'video',
      symptoms: symptoms || '',
      calendlyLink: calendlyLink || `https://calendly.com/your-clinic/consultation`,
      status: 'scheduled',
      bookingSource: 'calendly'
    });

    const savedAppointment = await appointmentRecord.save();
    console.log('Calendly appointment saved to database:', savedAppointment);

    res.status(200).json({
      success: true,
      message: 'Calendly appointment booked successfully and email notification sent',
      data: {
        appointmentId: savedAppointment._id,
        appointment: savedAppointment
      }
    });

  } catch (error) {
    console.error('Error booking Calendly appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment and send notification',
      error: error.message
    });
  }
});

/**
 * POST /api/calendly/send-doctor-notification
 * Send appointment notification to doctor
 */
router.post('/send-doctor-notification', async (req, res) => {
  try {
    const {
      doctorEmail,
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      consultationType,
      symptoms,
      doctorName,
      doctorSpecialty,
      calendlyLink
    } = req.body;

    if (!doctorEmail) {
      return res.status(400).json({
        success: false,
        message: 'Doctor email is required'
      });
    }

    // Send notification to doctor with patient details
    await sendCalendlyAppointmentNotification({
      to: doctorEmail,
      patientName,
      patientEmail,
      patientPhone,
      doctorName: doctorName || 'Dr. Smith',
      doctorSpecialty: doctorSpecialty || 'General Medicine',
      appointmentDate,
      appointmentTime,
      consultationType: consultationType || 'video',
      symptoms: symptoms || '',
      calendlyLink: calendlyLink || `https://calendly.com/your-clinic/consultation`
    });

    res.status(200).json({
      success: true,
      message: 'Doctor notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending doctor notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send doctor notification',
      error: error.message
    });
  }
});

/**
 * GET /api/calendly/appointments
 * Get all scheduled appointments for doctors
 */
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await CalendlyAppointment.find({})
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

/**
 * GET /api/calendly/appointments/:doctorName
 * Get appointments for a specific doctor
 */
router.get('/appointments/:doctorName', async (req, res) => {
  try {
    const { doctorName } = req.params;
    const appointments = await CalendlyAppointment.find({ 
      doctorName: new RegExp(doctorName, 'i') // Case insensitive search
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Appointments for ${doctorName} retrieved successfully`,
      data: appointments
    });

  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments',
      error: error.message
    });
  }
});

/**
 * DELETE /api/calendly/appointments/:id
 * Delete a specific appointment
 */
router.delete('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedAppointment = await CalendlyAppointment.findByIdAndDelete(id);
    
    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully',
      data: deletedAppointment
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
});

module.exports = router;
