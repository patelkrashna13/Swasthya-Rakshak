const Ward = require('../models/Ward');
const Bed = require('../models/Bed');
const PatientAssignment = require('../models/PatientAssignment');
const mongoose = require('mongoose');

// @desc    Add new ward
// @route   POST /api/ward-bed/wards
// @access  Public
const addWard = async (req, res) => {
  try {
    const { WardName, Type, Capacity, Location, Status } = req.body;

    if (!WardName || !Capacity) {
      return res.status(400).json({ message: 'Please include Ward Name and Capacity' });
    }

    const ward = await Ward.create({
      WardName,
      Type,
      Capacity: Number(Capacity),
      Location,
      Status: Status || 'Active',
      CurrentOccupancy: 0
    });

    res.status(201).json(ward);
  } catch (error) {
    console.error('Error adding ward:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add new bed
// @route   POST /api/ward-bed/beds
// @access  Public
const addBed = async (req, res) => {
  try {
    const { WardID, BedNumber, Status } = req.body;

    if (!WardID || !BedNumber) {
      return res.status(400).json({ message: 'Please include Ward ID and Bed Number' });
    }

    // Validate WardID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(WardID)) {
      return res.status(400).json({ message: 'Invalid Ward ID format' });
    }

    // Check if ward exists
    const ward = await Ward.findById(WardID);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    const bed = await Bed.create({
      WardID,
      BedNumber,
      Status: Status || 'Available'
    });

    res.status(201).json(bed);
  } catch (error) {
    console.error('Error adding bed:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Assign patient to bed
// @route   POST /api/ward-bed/assignments
// @access  Public
const addPatientAssignment = async (req, res) => {
  try {
    const { PatientID, WardID, BedID, AdmitDate, Status } = req.body;

    if (!PatientID || !WardID || !BedID || !AdmitDate) {
      return res.status(400).json({ message: 'Please include Patient ID, Ward ID, Bed ID, and Admit Date' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(PatientID) || 
        !mongoose.Types.ObjectId.isValid(WardID) || 
        !mongoose.Types.ObjectId.isValid(BedID)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Check if bed is available
    const bed = await Bed.findById(BedID);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    if (bed.Status === 'Occupied') {
      return res.status(400).json({ message: 'Bed is already occupied' });
    }

    const assignment = await PatientAssignment.create({
      PatientID,
      WardID,
      BedID,
      AdmitDate: new Date(AdmitDate),
      Status: Status || 'Admitted'
    });

    // Update bed status
    await Bed.findByIdAndUpdate(BedID, { Status: 'Occupied' });

    // Update ward occupancy
    await Ward.findByIdAndUpdate(WardID, { $inc: { CurrentOccupancy: 1 } });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error adding patient assignment:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all wards
// @route   GET /api/ward-bed/wards
// @access  Public
const getWards = async (req, res) => {
  try {
    const wards = await Ward.find().sort({ WardName: 1 });
    res.status(200).json(wards);
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all beds
// @route   GET /api/ward-bed/beds
// @access  Public
const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find()
      .populate('WardID', 'WardName Type Location')
      .sort({ BedNumber: 1 });
    res.status(200).json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all patient assignments
// @route   GET /api/ward-bed/assignments
// @access  Public
const getPatientAssignments = async (req, res) => {
  try {
    const assignments = await PatientAssignment.find()
      .populate('PatientID', 'patientName age gender')
      .populate('WardID', 'WardName Type Location')
      .populate('BedID', 'BedNumber Status')
      .sort({ AdmitDate: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching patient assignments:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
  addWard, 
  addBed, 
  addPatientAssignment,
  getWards,
  getBeds,
  getPatientAssignments
}; 