import React from 'react';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiBriefcase, 
  FiBookmark, 
  FiUser,
  FiEye,
  FiCalendar
} from 'react-icons/fi';
import './ActivityTimeline.css';

const ActivityTimeline = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'resume_uploaded':
        return <FiFileText />;
      case 'resume_analyzed':
        return <FiCheckCircle />;
      case 'job_applied':
        return <FiBriefcase />;
      case 'job_saved':
        return <FiBookmark />;
      case 'profile_updated':
        return <FiUser />;
      case 'profile_viewed':
        return <FiEye />;
      case 'interview_scheduled':
        return <FiCalendar />;
      default:
        return <FiCheckCircle />;
    }
  };

  const getColor = (type) => {
    const colors = {
      resume_uploaded: '#667EEA',
      resume_analyzed: '#4FACFE',
      job_applied: '#F093FB',
      job_saved: '#FEC163',
      profile_updated: '#FA709A',
      profile_viewed: '#764BA2',
      interview_scheduled: '#4FACFE'
    };
    return colors[type] || '#667EEA';
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return activityDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: activityDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-timeline">
        <h3 className="timeline-title">Recent Activity</h3>
        <div className="empty-timeline">
          <div className="empty-icon">📭</div>
          <p className="empty-text">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      <h3 className="timeline-title">Recent Activity</h3>
      <div className="timeline-list">
        {activities.map((activity, index) => (
          <div key={activity._id || index} className="timeline-item">
            <div 
              className="timeline-icon"
              style={{ 
                backgroundColor: `${getColor(activity.type)}20`,
                color: getColor(activity.type)
              }}
            >
              {getIcon(activity.type)}
            </div>
            <div className="timeline-content">
              <h4 className="timeline-item-title">{activity.title}</h4>
              {activity.description && (
                <p className="timeline-item-desc">{activity.description}</p>
              )}
              <span className="timeline-item-time">
                {formatDate(activity.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimeline;
