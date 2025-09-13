const Staff = require('../models/Staff');

// @desc    Add new staff member
// @route   POST /api/staff
// @access  Public
const addStaff = async (req, res) => {
  try {
    const { name, age, gender, role, department, qualification, experience, mobileNo, email, schedule, employmentStatus } = req.body;

    // Basic validation (you can add more comprehensive validation)
    if (!name) {
      return res.status(400).json({ message: 'Please include a name' });
    }

    const staff = await Staff.create({
      name,
      age,
      gender,
      role,
      department,
      qualification,
      experience,
      mobileNo,
      email,
      schedule,
      employmentStatus,
    });

    res.status(201).json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Public
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addStaff, getStaff };