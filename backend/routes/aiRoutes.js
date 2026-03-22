const express = require('express');
const router = express.Router();
const { generateSummary, regenerateSummary } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// AI summary routes
router.post('/generate-summary', protect, generateSummary);
router.post('/regenerate-summary', protect, regenerateSummary);

module.exports = router;
