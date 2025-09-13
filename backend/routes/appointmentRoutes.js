const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Get all appointments (accessible by both doctors and patients)
router.get(
  '/', 
  authenticateUser, 
  authorizeRoles(['doctor', 'patient']),
  appointmentController.getAppointments
);

// Create a new appointment (accessible by patients)
router.post(
  '/', 
  authenticateUser,
  authorizeRoles(['patient']),
  appointmentController.createAppointment
);

// Get appointment by ID (accessible by both)
router.get(
  '/:id',
  authenticateUser,
  authorizeRoles(['doctor', 'patient']),
  appointmentController.getAppointmentById
);

// Update an appointment (accessible by both)
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles(['doctor', 'patient']),
  appointmentController.updateAppointment
);

// Cancel an appointment (accessible by both)
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles(['doctor', 'patient']),
  appointmentController.cancelAppointment
);

// Get doctor's availability (for scheduling)
router.get(
  '/availability/:doctorId',
  authenticateUser,
  appointmentController.getDoctorAvailability
);

module.exports = router;