const Resume = require('../models/Resume');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { analyzeResume, calculateATSScore } = require('../utils/resumeAnalyzer');

// @desc    Upload and analyze resume
// @route   POST /api/resume/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    // Read PDF file
    const dataBuffer = await fs.readFile(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    // Analyze resume
    const analysis = analyzeResume(extractedText);
    const atsScore = calculateATSScore(analysis);

    // Create resume record
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      extractedText,
      analysis: {
        ...analysis,
        atsScore,
        overallScore: Math.round((atsScore + analysis.readabilityScore + analysis.formattingScore) / 3)
      },
      status: 'analyzed'
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message
    });
  }
};

// @desc    Get all user resumes
// @route   GET /api/resume
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resume/:id
// @access  Private
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resume'
      });
    }

    // Delete file
    try {
      await fs.unlink(resume.filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message
    });
  }
};

// @desc    Get resume analysis
// @route   GET /api/resume/:id/analysis
// @access  Private
exports.getResumeAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check ownership
    if (resume.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    res.status(200).json({
      success: true,
      analysis: resume.analysis
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysis',
      error: error.message
    });
  }
};
