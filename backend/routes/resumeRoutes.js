const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
  getResumeAnalysis
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResume);
router.delete('/:id', protect, deleteResume);
router.get('/:id/analysis', protect, getResumeAnalysis);

module.exports = router;
