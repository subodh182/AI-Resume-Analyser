import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import api from '../services/api';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiAward } from 'react-icons/fi';
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
        <p className="loading-text">Analyzing your resume...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-container">
        <h2 className="error-title">Resume not found</h2>
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
      backgroundColor: ['#4FACFE', 'rgba(255, 255, 255, 0.1)'],
      borderWidth: 0
    }]
  };

  const overallScoreData = {
    labels: ['Overall Score', 'Remaining'],
    datasets: [{
      data: [analysis.overallScore, 100 - analysis.overallScore],
      backgroundColor: ['#667EEA', 'rgba(255, 255, 255, 0.1)'],
      borderWidth: 0
    }]
  };

  // Skills Chart Data
  const skillsChartData = {
    labels: analysis.skillsFound.slice(0, 8).map(s => s.skill),
    datasets: [{
      label: 'Skills',
      data: analysis.skillsFound.slice(0, 8).map(() => 1),
      backgroundColor: '#4FACFE',
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
        ticks: { color: '#9B9BBF', font: { size: 11 } },
        grid: { display: false }
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4FACFE';
    if (score >= 60) return '#FEC163';
    return '#FA709A';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return '#FA709A';
    if (priority === 'medium') return '#FEC163';
    return '#4FACFE';
  };

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        {/* Header */}
        <div className="analysis-header">
          <Link to="/dashboard" className="back-btn">
            <FiArrowLeft /> <span>Back to Dashboard</span>
          </Link>
          <div className="header-content">
            <h1 className="page-title">{resume.fileName}</h1>
            <p className="upload-date">
              Analyzed on {new Date(resume.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
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
                <div className="score-label">ATS</div>
              </div>
            </div>
            <div className="score-info">
              <h3 className="score-title">ATS Compatibility</h3>
              <p className="score-description">
                How well your resume performs with Applicant Tracking Systems
              </p>
            </div>
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
            <div className="score-info">
              <h3 className="score-title">Overall Quality</h3>
              <p className="score-description">
                Combined score based on all evaluation factors
              </p>
            </div>
          </div>

          <div className="score-card stats-card">
            <div className="stat-item">
              <div className="stat-icon"><FiTrendingUp /></div>
              <div className="stat-content">
                <div className="stat-value">{analysis.readabilityScore}%</div>
                <div className="stat-label">Readability Score</div>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-icon"><FiAward /></div>
              <div className="stat-content">
                <div className="stat-value">{analysis.formattingScore}%</div>
                <div className="stat-label">Formatting Quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="analysis-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiCheckCircle className="section-icon" />
              Skills Detected: <span className="highlight">{analysis.skillsFound.length}</span>
            </h2>
          </div>
          
          {analysis.skillsFound.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💡</div>
              <h3 className="empty-title">No skills detected</h3>
              <p className="empty-description">
                Add more technical skills to your resume to improve your ATS score and match with relevant jobs.
              </p>
            </div>
          ) : (
            <div className="skills-content">
              <div className="skills-list">
                {analysis.skillsFound.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill.skill}
                  </span>
                ))}
              </div>
              {analysis.skillsFound.length >= 8 && (
                <div className="skills-chart">
                  <h4 className="chart-title">Top Skills Distribution</h4>
                  <Bar data={skillsChartData} options={barChartOptions} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sections Check */}
        <div className="analysis-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiCheckCircle className="section-icon" />
              Resume Sections
            </h2>
          </div>
          <div className="sections-grid">
            {Object.entries(analysis.sections).map(([key, value]) => (
              <div key={key} className={`section-item ${value ? 'present' : 'missing'}`}>
                <div className="section-icon-wrapper">
                  {value ? <FiCheckCircle /> : <FiAlertCircle />}
                </div>
                <span className="section-name">
                  {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Improvements Section */}
        {analysis.improvements && analysis.improvements.length > 0 && (
          <div className="analysis-section">
            <div className="section-header">
              <h2 className="section-title">
                <FiAlertCircle className="section-icon" />
                Detailed Improvement Roadmap ({analysis.improvements.length})
              </h2>
              <p className="section-subtitle">
                Follow these actionable steps to significantly improve your resume
              </p>
            </div>
            
            <div className="improvements-roadmap">
              {analysis.improvements.map((improvement, index) => (
                <div key={index} className={`improvement-card priority-${improvement.priority}`}>
                  {/* Header */}
                  <div className="improvement-card-header">
                    <div className="improvement-title-section">
                      <span className="improvement-number">{index + 1}</span>
                      <h3 className="improvement-title">{improvement.category}</h3>
                    </div>
                    <div className="priority-badges">
                      <span 
                        className={`priority-badge ${improvement.priority}`}
                        style={{ 
                          backgroundColor: `${getPriorityColor(improvement.priority)}20`,
                          color: getPriorityColor(improvement.priority)
                        }}
                      >
                        {improvement.priority} priority
                      </span>
                      {improvement.impact && (
                        <span className="impact-badge">
                          {improvement.impact}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Issue */}
                  <div className="improvement-issue">
                    <strong>❌ Issue:</strong> {improvement.issue}
                  </div>

                  {/* Suggestion */}
                  <div className="improvement-suggestion-box">
                    <strong>💡 Suggestion:</strong> {improvement.suggestion}
                  </div>

                  {/* What to Add */}
                  {improvement.whatToAdd && (
                    <div className="improvement-detail">
                      <strong>📝 What to Add:</strong>
                      <ul className="checklist">
                        {improvement.whatToAdd.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Example */}
                  {improvement.example && (
                    <div className="improvement-example">
                      <strong>✅ Example:</strong>
                      <div className="example-box">
                        <pre>{improvement.example}</pre>
                      </div>
                    </div>
                  )}

                  {/* Before/After */}
                  {improvement.beforeAfter && (
                    <div className="before-after">
                      <div className="before">
                        <strong>❌ Before:</strong>
                        <p>{improvement.beforeAfter.before}</p>
                      </div>
                      <div className="arrow">→</div>
                      <div className="after">
                        <strong>✅ After:</strong>
                        <p>{improvement.beforeAfter.after}</p>
                      </div>
                    </div>
                  )}

                  {/* How To */}
                  {improvement.howTo && (
                    <div className="improvement-detail">
                      <strong>🎯 How to Implement:</strong>
                      <ul className="how-to-list">
                        {improvement.howTo.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources */}
                  {improvement.resources && improvement.resources.length > 0 && (
                    <div className="improvement-resources">
                      <strong>📚 Helpful Resources:</strong>
                      <div className="resource-links">
                        {improvement.resources.map((resource, i) => (
                          <a key={i} href={resource.url || '#'} className="resource-link">
                            <span className="resource-type">{resource.type}</span>
                            <span className="resource-title">{resource.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Action Summary */}
            <div className="quick-action-summary">
              <h3>🎯 Quick Action Summary</h3>
              <div className="action-cards">
                <div className="action-card high">
                  <div className="action-count">
                    {analysis.improvements.filter(i => i.priority === 'high').length}
                  </div>
                  <div className="action-label">High Priority Items</div>
                  <p>Fix these first for maximum impact</p>
                </div>
                <div className="action-card medium">
                  <div className="action-count">
                    {analysis.improvements.filter(i => i.priority === 'medium').length}
                  </div>
                  <div className="action-label">Medium Priority Items</div>
                  <p>Important but not urgent</p>
                </div>
                <div className="action-card low">
                  <div className="action-count">
                    {analysis.improvements.filter(i => i.priority === 'low').length}
                  </div>
                  <div className="action-label">Low Priority Items</div>
                  <p>Nice to have improvements</p>
                </div>
              </div>
            </div>

            {/* Professional Help CTA */}
            <div className="professional-help-cta">
              <div className="cta-content">
                <h4>🚀 Need Expert Help?</h4>
                <p>Connect with professional resume writers who can transform your resume to get more interviews</p>
                <div className="cta-buttons">
                  <button className="btn btn-primary">
                    Find Resume Experts
                  </button>
                  <button className="btn btn-secondary">
                    Book Free Consultation
                  </button>
                </div>
              </div>
              <div className="cta-stats">
                <div className="stat">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat">
                  <div className="stat-number">2.5x</div>
                  <div className="stat-label">More Interviews</div>
                </div>
                <div className="stat">
                  <div className="stat-number">$49</div>
                  <div className="stat-label">Starting Price</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keywords */}
        {analysis.keywordMatches && analysis.keywordMatches.length > 0 && (
          <div className="analysis-section">
            <div className="section-header">
              <h2 className="section-title">Top Keywords Found</h2>
            </div>
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
