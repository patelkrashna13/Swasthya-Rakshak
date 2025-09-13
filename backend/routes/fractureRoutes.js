const express = require('express');
const router = express.Router();
const {
  predictFracture,
  getModelInfo,
  healthCheck
} = require('../controllers/fractureController');

// Health check endpoint
router.get('/health', healthCheck);

// Get model information
router.get('/model-info', getModelInfo);

// Predict fracture from uploaded X-ray image
router.post('/predict', predictFracture);

module.exports = router;
