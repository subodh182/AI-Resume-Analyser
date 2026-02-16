const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  applyToJob,
  getMatchedJobs
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.get('/', getJobs);
router.get('/matches/:resumeId', protect, getMatchedJobs);
router.get('/:id', getJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;
