const Appointment = require('../models/Appointment');
const googleCalendarService = require('../services/googleCalendarService');
const emailService = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let query = {};
    
    if (role === 'doctor') {
      query.doctorId = userId;
    } else if (role === 'patient') {
      query.patientId = userId;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: 1, time: 1 });
      
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// Create a new appointment with Google Meet
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, ...appointmentData } = req.body;
    
    // Create Google Meet event
    const meetDetails = await googleCalendarService.createMeeting({
      ...appointmentData,
      patientEmail: req.body.patientEmail,
      doctorEmail: req.body.doctorEmail,
      date,
      time
    });

    // Create appointment in database
    const appointment = new Appointment({
      ...appointmentData,
      patientId,
      doctorId,
      date: new Date(date),
      time,
      meetingLink: meetDetails.meetingLink,
      meetingId: meetDetails.meetingId,
      status: 'scheduled'
    });

    await appointment.save();
    
    // Populate the doctor and patient details
    const savedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    // Send confirmation email to patient
    try {
      await emailService.sendAppointmentConfirmation({
        to: req.body.patientEmail,
        patientName: req.body.patientName,
        doctorName: req.body.doctorName,
        date: date,
        time: time,
        meetLink: meetDetails.meetingLink
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to create appointment', 
      error: error.message 
    });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id, 
      { ...updates, updatedAt: Date.now() },
      { new: true }
    )
    .populate('patientId', 'name email')
    .populate('doctorId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        status: 'cancelled',
        updatedAt: Date.now() 
      },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Cancel the Google Meet if it exists
    if (appointment.meetingId) {
      await googleCalendarService.cancelMeeting(appointment.meetingId);
    }
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Failed to cancel appointment' });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');
      
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Failed to fetch appointment' });
  }
};

// Get doctor's availability
// In a real app, this would check the doctor's schedule and existing appointments
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // Expected format: YYYY-MM-DD

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    // In a real app, you would:
    // 1. Get the doctor's working hours
    // 2. Get all appointments for the doctor on the specified date
    // 3. Calculate available time slots

    // For now, return a mock response with all time slots available
    // In a real implementation, you would filter out booked slots
    const availableSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
    ];

    res.json({
      doctorId,
      date: date || 'any',
      availableSlots,
      message: 'This is a mock response. In a real app, this would check the doctor\'s schedule.'
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ message: 'Failed to fetch doctor availability' });
  }
};