const express = require('express');
const router = express.Router();
const consultancyController = require('../controllers/consultancyController');

router.get('/', consultancyController.getConsultancies);
router.post('/', consultancyController.createConsultancy);

module.exports = router; 