import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';
import { FiArrowLeft, FiDownload, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import './ResumeAnalysis.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ResumeAnalysis = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await api.get(`/resume/${id}`);
      setResume(res.data.resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Analyzing your resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-container">
        <h2>Resume not found</h2>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  const { analysis } = resume;

  // Score Chart Data
  const scoreData = {
    labels: ['ATS Score', 'Remaining'],
    datasets: [{
      data: [analysis.atsScore, 100 - analysis.atsScore],
      backgroundColor: ['#FF3366', 'rgba(255, 255, 255, 0.1)'],
      borderWidth: 0
    }]
  };

  const overallScoreData = {
    labels: ['Overall Score', 'Remaining'],
    datasets: [{
      data: [analysis.overallScore, 100 - analysis.overallScore],
      backgroundColor: ['#6366F1', 'rgba(255, 255, 255, 0.1)'],
      borderWidth: 0
    }]
  };

  // Skills Chart Data
  const skillsChartData = {
    labels: analysis.skillsFound.slice(0, 8).map(s => s.skill),
    datasets: [{
      label: 'Skills Detected',
      data: analysis.skillsFound.slice(0, 8).map(() => 1),
      backgroundColor: '#10B981',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { display: false },
      x: { 
        ticks: { color: '#64748B' },
        grid: { display: false }
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#EF4444';
    if (priority === 'medium') return '#F59E0B';
    return '#10B981';
  };

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        {/* Header */}
        <div className="analysis-header">
          <Link to="/dashboard" className="back-btn">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1>{resume.fileName}</h1>
          <p className="upload-date">
            Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Score Cards */}
        <div className="score-cards">
          <div className="score-card">
            <div className="score-chart">
              <Doughnut data={scoreData} options={chartOptions} />
              <div className="score-overlay">
                <div className="score-value" style={{ color: getScoreColor(analysis.atsScore) }}>
                  {analysis.atsScore}
                </div>
                <div className="score-label">ATS Score</div>
              </div>
            </div>
            <p className="score-description">
              Your resume's compatibility with Applicant Tracking Systems
            </p>
          </div>

          <div className="score-card">
            <div className="score-chart">
              <Doughnut data={overallScoreData} options={chartOptions} />
              <div className="score-overlay">
                <div className="score-value" style={{ color: getScoreColor(analysis.overallScore) }}>
                  {analysis.overallScore}
                </div>
                <div className="score-label">Overall</div>
              </div>
            </div>
            <p className="score-description">
              Combined score based on all factors
            </p>
          </div>

          <div className="score-card">
            <div className="stat-item">
              <FiTrendingUp className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">{analysis.readabilityScore}%</div>
                <div className="stat-label">Readability</div>
              </div>
            </div>
            <div className="stat-item">
              <FiCheckCircle className="stat-icon" />
              <div className="stat-content">
                <div className="stat-value">{analysis.formattingScore}%</div>
                <div className="stat-label">Formatting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="analysis-section">
          <h2><FiCheckCircle /> Skills Detected ({analysis.skillsFound.length})</h2>
          <div className="skills-content">
            <div className="skills-list">
              {analysis.skillsFound.map((skill, index) => (
                <span key={index} className="skill-badge badge-success">
                  {skill.skill}
                </span>
              ))}
              {analysis.skillsFound.length === 0 && (
                <p className="empty-message">No skills detected. Add more technical skills to your resume.</p>
              )}
            </div>
            {analysis.skillsFound.length > 0 && (
              <div className="skills-chart">
                <Bar data={skillsChartData} options={barChartOptions} />
              </div>
            )}
          </div>
        </div>

        {/* Sections Check */}
        <div className="analysis-section">
          <h2><FiCheckCircle /> Resume Sections</h2>
          <div className="sections-grid">
            {Object.entries(analysis.sections).map(([key, value]) => (
              <div key={key} className={`section-item ${value ? 'present' : 'missing'}`}>
                {value ? <FiCheckCircle /> : <FiAlertCircle />}
                <span>{key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        {analysis.improvements.length > 0 && (
          <div className="analysis-section">
            <h2><FiAlertCircle /> Suggested Improvements</h2>
            <div className="improvements-list">
              {analysis.improvements.map((improvement, index) => (
                <div key={index} className="improvement-item">
                  <div className="improvement-header">
                    <span className="improvement-category">{improvement.category}</span>
                    <span 
                      className="improvement-priority"
                      style={{ color: getPriorityColor(improvement.priority) }}
                    >
                      {improvement.priority} priority
                    </span>
                  </div>
                  <p className="improvement-suggestion">{improvement.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {analysis.keywordMatches.length > 0 && (
          <div className="analysis-section">
            <h2>Top Keywords</h2>
            <div className="keywords-list">
              {analysis.keywordMatches.map((keyword, index) => (
                <span key={index} className="keyword-badge">
                  {keyword.keyword} <span className="keyword-count">×{keyword.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;