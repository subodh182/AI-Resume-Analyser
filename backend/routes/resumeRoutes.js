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
const { rankResumes, compareResumes } = require('../controllers/resumeRankController');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResume);
router.delete('/:id', protect, deleteResume);
router.get('/:id/analysis', protect, getResumeAnalysis);
router.post('/rank', protect, rankResumes);
router.post('/compare', protect, compareResumes);

module.exports = router;
