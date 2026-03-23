import React from 'react';
import { Link } from 'react-router-dom';
import './ApplicationTracker.css';

const ApplicationTracker = ({ applications }) => {
  const getStatusColor = (status) => {
    const colors = {
      applied: '#667EEA',
      viewed: '#4FACFE',
      shortlisted: '#F093FB',
      interview: '#FEC163',
      rejected: '#FA709A',
      offered: '#4FACFE',
      accepted: '#4FACFE'
    };
    return colors[status] || '#667EEA';
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const stats = {
    applied: applications?.filter(a => a.status === 'applied').length || 0,
    viewed: applications?.filter(a => a.status === 'viewed').length || 0,
    interview: applications?.filter(a => a.status === 'interview').length || 0,
    offered: applications?.filter(a => a.status === 'offered').length || 0
  };

  return (
    <div className="application-tracker">
      <div className="tracker-header">
        <h3 className="tracker-title">Application Tracker</h3>
        <Link to="/applications" className="view-all-link">
          View All →
        </Link>
      </div>

      {/* Status Stats */}
      <div className="status-stats">
        <div className="status-stat">
          <div className="stat-count">{stats.applied}</div>
          <div className="stat-label">Applied</div>
        </div>
        <div className="status-stat">
          <div className="stat-count">{stats.viewed}</div>
          <div className="stat-label">Viewed</div>
        </div>
        <div className="status-stat">
          <div className="stat-count">{stats.interview}</div>
          <div className="stat-label">Interview</div>
        </div>
        <div className="status-stat">
          <div className="stat-count">{stats.offered}</div>
          <div className="stat-label">Offered</div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="recent-applications">
        <h4 className="section-subtitle">Recent Applications</h4>
        {!applications || applications.length === 0 ? (
          <div className="empty-applications">
            <div className="empty-icon">📋</div>
            <p className="empty-text">No applications yet</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="applications-list">
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="application-item">
                <div className="app-info">
                  <h5 className="app-title">{app.job?.title || 'Job Title'}</h5>
                  <p className="app-company">{app.job?.company || 'Company'}</p>
                  <p className="app-date">
                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <div 
                  className="app-status"
                  style={{ 
                    backgroundColor: `${getStatusColor(app.status)}20`,
                    color: getStatusColor(app.status)
                  }}
                >
                  {getStatusLabel(app.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;
