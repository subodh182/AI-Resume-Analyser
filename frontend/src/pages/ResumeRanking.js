import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiAward } from 'react-icons/fi';
import api from '../services/api';
import './ResumeRanking.css';

const ResumeRanking = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [rankings, setRankings] = useState([]);
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

  const handleSelect = (resumeId) => {
    if (selectedResumes.includes(resumeId)) {
      setSelectedResumes(selectedResumes.filter(id => id !== resumeId));
    } else {
      setSelectedResumes([...selectedResumes, resumeId]);
    }
  };

  const handleRank = async () => {
    if (selectedResumes.length < 2) {
      setError('Please select at least 2 resumes');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/resume/rank', {
        resumeIds: selectedResumes
      });

      setRankings(res.data.rankings);
    } catch (err) {
      setError(err.response?.data?.message || 'Error ranking resumes');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#667EEA';
  };

  return (
    <div className="ranking-page">
      <div className="ranking-container">
        <div className="page-header">
          <h1>Resume Ranking System</h1>
          <p>Compare and rank your resumes based on ATS compatibility and overall quality</p>
        </div>

        {/* Resume Selection */}
        <div className="selection-section">
          <h3>Select Resumes to Compare</h3>
          <div className="resumes-grid">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className={`resume-card ${selectedResumes.includes(resume._id) ? 'selected' : ''}`}
                onClick={() => handleSelect(resume._id)}
              >
                <input
                  type="checkbox"
                  checked={selectedResumes.includes(resume._id)}
                  onChange={() => {}}
                  className="resume-checkbox"
                />
                <h4>{resume.fileName}</h4>
                <div className="resume-scores">
                  <span>ATS: {resume.analysis?.atsScore || 0}%</span>
                  <span>Overall: {resume.analysis?.overallScore || 0}%</span>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleRank}
            disabled={loading || selectedResumes.length < 2}
            className="btn btn-primary btn-rank"
          >
            {loading ? 'Ranking...' : `Rank ${selectedResumes.length} Resumes`}
          </button>
        </div>

        {/* Rankings Display */}
        {rankings.length > 0 && (
          <div className="rankings-section">
            <h3>
              <FiAward /> Rankings
            </h3>
            {rankings.map((item) => (
              <div
                key={item.resumeId}
                className="ranking-item"
                style={{ borderLeftColor: getRankColor(item.rank) }}
              >
                <div className="rank-badge" style={{ background: getRankColor(item.rank) }}>
                  #{item.rank}
                </div>
                <div className="ranking-info">
                  <h4>{item.fileName}</h4>
                  <div className="ranking-stats">
                    <span>Final Score: {item.finalScore}</span>
                    <span>ATS: {item.atsScore}%</span>
                    <span>Overall: {item.overallScore}%</span>
                    <span>Skills: {item.skillsCount}</span>
                  </div>
                </div>
                {item.rank === 1 && (
                  <div className="winner-badge">
                    <FiTrendingUp /> Best Resume
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeRanking;
