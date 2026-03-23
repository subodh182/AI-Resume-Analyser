import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import './ResumeSummaryGenerator.css';

const ResumeSummaryGenerator = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [tone, setTone] = useState('professional');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleGenerate = async () => {
    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/ai/generate-summary', {
        resumeId: selectedResume,
        tone
      });

      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating summary');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional', desc: 'Formal and business-focused' },
    { value: 'creative', label: 'Creative', desc: 'Dynamic and innovative' },
    { value: 'concise', label: 'Concise', desc: 'Brief and to the point' },
    { value: 'detailed', label: 'Detailed', desc: 'Comprehensive and thorough' }
  ];

  return (
    <div className="summary-generator-page">
      <div className="summary-container">
        <div className="page-header">
          <h1>AI Resume Summary Generator</h1>
          <p>Generate professional summaries tailored to your experience</p>
        </div>

        <div className="generator-grid">
          {/* Input Section */}
          <div className="input-section">
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
                    {resume.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Choose Tone</label>
              <div className="tone-options">
                {toneOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`tone-card ${tone === option.value ? 'active' : ''}`}
                    onClick={() => setTone(option.value)}
                  >
                    <h4>{option.label}</h4>
                    <p>{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn btn-primary btn-generate"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" /> Generating...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>

          {/* Output Section */}
          {summary && (
            <div className="output-section">
              <div className="output-header">
                <h3>Generated Summary</h3>
                <button onClick={handleCopy} className="btn-copy">
                  {copied ? (
                    <>
                      <FiCheck /> Copied!
                    </>
                  ) : (
                    <>
                      <FiCopy /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="summary-output">
                <p>{summary}</p>
              </div>
              <div className="output-actions">
                <button
                  onClick={handleGenerate}
                  className="btn btn-secondary"
                >
                  <FiRefreshCw /> Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeSummaryGenerator;
