const LabTest = require('../models/LabTest'); // Adjust path as needed

// @desc    Create new lab test record
// @route   POST /api/labrecords
// @access  Public (You might want to change this based on authentication)
const createLabTest = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      testType,
      testName,
      orderDate,
      sampleCollectionDate,
      status,
      resultDate,
      resultSummary,
      diagnosticEquipmentId,
      remarks,
    } = req.body;

    // Create a new LabTest document
    const labTest = new LabTest({
      patientId,
      doctorId,
      testType,
      testName,
      orderDate,
      sampleCollectionDate,
      status,
      resultDate,
      resultSummary,
      diagnosticEquipmentId,
      remarks,
    });

    // Save the document to the database
    const savedLabTest = await labTest.save();

    // Send a success response
    res.status(201).json(savedLabTest);

  } catch (error) {
    console.error('Error saving lab test record:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all lab records
// @route   GET /api/labrecords
// @access  Public
const getLabRecords = async (req, res) => {
  try {
    const labRecords = await LabTest.find().sort({ createdAt: -1 });
    res.status(200).json(labRecords);
  } catch (error) {
    console.error('Error fetching lab records:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createLabTest,
  getLabRecords,
};