const express = require('express');
const router = express.Router();
const { analyzeJobMatch } = require('../controllers/jobMatchController');
const { protect } = require('../middleware/auth');

// Job matching route
router.post('/analyze', protect, analyzeJobMatch);

module.exports = router;
