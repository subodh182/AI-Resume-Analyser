import React, { useState, useEffect } from 'react';
import { FiUpload, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import './JobMatch.css';

const JobMatch = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !jobDescription.trim()) {
      setError('Please select a resume and paste job description');
      return;
    }

    setLoading(true);
    setError('');
    setMatchResult(null);

    try {
      const res = await api.post('/job-match/analyze', {
        resumeId: selectedResume,
        jobDescription
      });

      setMatchResult(res.data.matchAnalysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing match');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#EF4444';
    if (priority === 'medium') return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <div className="job-match-page">
      <div className="job-match-container">
        <div className="page-header">
          <h1>Job Description Matching</h1>
          <p>Check how well your resume matches a job description</p>
        </div>

        <div className="match-form">
          {/* Resume Selection */}
          <div className="form-group">
            <label>Select Your Resume</label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.fileName} - ATS: {resume.analysis?.atsScore || 0}%
                </option>
              ))}
            </select>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label>Paste Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
              rows="12"
              className="form-textarea"
            />
          </div>

          {error && (
            <div className="error-message">
              <FiAlertCircle /> {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary btn-analyze"
          >
            {loading ? 'Analyzing...' : 'Analyze Match'}
          </button>
        </div>

        {/* Match Results */}
        {matchResult && (
          <div className="match-results">
            {/* Match Score */}
            <div className="match-score-card">
              <h2>Resume Match Score</h2>
              <div
                className="match-percentage"
                style={{ color: getMatchColor(matchResult.matchPercentage) }}
              >
                {matchResult.matchPercentage}%
              </div>
              <div className="match-stats">
                <div className="stat">
                  <span className="stat-label">Matching Skills</span>
                  <span className="stat-value">{matchResult.matchingSkills.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Missing Skills</span>
                  <span className="stat-value">{matchResult.missingSkills.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Required Skills</span>
                  <span className="stat-value">{matchResult.totalJobSkills}</span>
                </div>
              </div>
            </div>

            {/* Matching Skills */}
            {matchResult.matchingSkills.length > 0 && (
              <div className="skills-section">
                <h3>
                  <FiCheckCircle style={{ color: '#10B981' }} />
                  Matching Skills ({matchResult.matchingSkills.length})
                </h3>
                <div className="skills-grid">
                  {matchResult.matchingSkills.map((skill, index) => (
                    <span key={index} className="skill-tag skill-match">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {matchResult.missingSkills.length > 0 && (
              <div className="skills-section">
                <h3>
                  <FiXCircle style={{ color: '#EF4444' }} />
                  Missing Skills ({matchResult.missingSkills.length})
                </h3>
                <div className="skills-grid">
                  {matchResult.missingSkills.map((skill, index) => (
                    <span key={index} className="skill-tag skill-missing">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {matchResult.recommendations.length > 0 && (
              <div className="recommendations-section">
                <h3>Recommendations</h3>
                {matchResult.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="recommendation-card"
                    style={{ borderLeftColor: getPriorityColor(rec.priority) }}
                  >
                    <div className="rec-header">
                      <span className="rec-title">{rec.title}</span>
                      <span
                        className="rec-priority"
                        style={{ backgroundColor: getPriorityColor(rec.priority) }}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="rec-message">{rec.message}</p>
                    {rec.skills && (
                      <div className="rec-skills">
                        {rec.skills.map((skill, idx) => (
                          <span key={idx} className="rec-skill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="rec-action">
                      <strong>Action:</strong> {rec.action}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatch;
