const express = require('express');
const router = express.Router();
const { 
  addWard, 
  addBed, 
  addPatientAssignment,
  getWards,
  getBeds,
  getPatientAssignments
} = require('../controllers/wardBedController');

// Routes for Wards
router.get('/wards', getWards);
router.post('/wards', addWard);
// Add routes for fetching, updating, deleting wards as needed

// Routes for Beds
router.get('/beds', getBeds);
router.post('/beds', addBed);
// Add routes for fetching, updating, deleting beds as needed

// Routes for Patient Assignments
router.get('/assignments', getPatientAssignments);
router.post('/assignments', addPatientAssignment);
// Add routes for fetching, updating, deleting patient assignments as needed

module.exports = router; 