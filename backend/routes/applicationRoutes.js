const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const applicationController = require('../controllers/applicationController');

router.get('/', protect, applicationController.getApplications);
router.post('/', protect, applicationController.createApplication);
router.put('/:id', protect, applicationController.updateApplication);
router.post('/:id/interview', protect, applicationController.addInterview);

module.exports = router;
