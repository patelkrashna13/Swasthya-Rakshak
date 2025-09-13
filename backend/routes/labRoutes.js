const express = require('express');
const router = express.Router();
const { createLabTest, getLabRecords } = require('../controllers/labController'); // Adjust path as needed

// GET /api/labrecords
router.get('/', getLabRecords);
// POST /api/labrecords
router.post('/', createLabTest);

// You can add other routes here later (e.g., GET '/:id', PUT '/:id', DELETE '/:id')

module.exports = router;