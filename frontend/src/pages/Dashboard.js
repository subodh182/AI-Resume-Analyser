import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiEye, FiPlus } from 'react-icons/fi';
import api, { getDashboardStats, getActivities, getApplications } from '../services/api';
import StatsCards from '../components/StatsCards';
import QuickActions from '../components/QuickActions';
import ActivityTimeline from '../components/ActivityTimeline';
import ApplicationTracker from '../components/ApplicationTracker';
import './Dashboard.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [resumesRes, statsRes, activitiesRes, applicationsRes] = await Promise.all([
        api.get('/resume'),
        getDashboardStats(),
        getActivities(10),
        getApplications()
      ]);
      
      setResumes(resumesRes.data.resumes || []);
      setStats(statsRes.data.stats || {});
      setActivities(activitiesRes.data.activities || []);
      setApplications(applicationsRes.data.applications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's your overview
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            <FiPlus /> Upload Resume
          </Link>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            {/* Recent Resumes */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recent Resumes</h2>
                <Link to="/resumes" className="view-all-link">
                  View All →
                </Link>
              </div>
              
              {resumes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <FiFileText />
                  </div>
                  <h3>No resumes yet</h3>
                  <p>Upload your first resume to get started</p>
                  <Link to="/upload" className="btn btn-primary">
                    Upload Resume
                  </Link>
                </div>
              ) : (
                <div className="resumes-grid">
                  {resumes.slice(0, 4).map((resume) => (
                    <Link
                      key={resume._id}
                      to={`/resume/${resume._id}`}
                      className="resume-card"
                    >
                      <div className="resume-icon">
                        <FiFileText />
                      </div>
                      <div className="resume-info">
                        <h3>{resume.fileName}</h3>
                        <div className="resume-stats">
                          <span className="badge badge-primary">
                            ATS: {resume.analysis?.atsScore || 0}%
                          </span>
                          <span className="badge badge-secondary">
                            Score: {resume.analysis?.overallScore || 0}%
                          </span>
                        </div>
                        <p className="resume-date">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="view-icon">
                        <FiEye />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <ActivityTimeline activities={activities} />
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            {/* Application Tracker */}
            <ApplicationTracker applications={applications} />

            {/* Profile Completion */}
            <div className="profile-completion-card">
              <h3>Profile Completion</h3>
              <div className="progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{
                      strokeDashoffset: 283 - (283 * (stats?.profileCompletion || 0)) / 100
                    }}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-value">{stats?.profileCompletion || 0}%</span>
                </div>
              </div>
              <p className="completion-text">
                Your profile is {stats?.profileCompletion || 0}% complete
              </p>
              <Link to="/profile" className="btn btn-secondary">
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
