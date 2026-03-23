import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUpload, 
  FiUser, 
  FiBriefcase, 
  FiFileText, 
  FiBarChart2,
  FiDownload
} from 'react-icons/fi';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      icon: <FiUpload />,
      title: 'Upload Resume',
      description: 'Analyze a new resume',
      link: '/upload',
      color: '#667EEA'
    },
    {
      icon: <FiUser />,
      title: 'Edit Profile',
      description: 'Update your information',
      link: '/profile',
      color: '#4FACFE'
    },
    {
      icon: <FiBriefcase />,
      title: 'Find Jobs',
      description: 'Browse matching jobs',
      link: '/jobs',
      color: '#F093FB'
    },
    {
      icon: <FiFileText />,
      title: 'Cover Letter',
      description: 'Generate cover letter',
      link: '#',
      color: '#FEC163'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Analytics',
      description: 'View your stats',
      link: '#',
      color: '#FA709A'
    },
    {
      icon: <FiDownload />,
      title: 'Download',
      description: 'Export all resumes',
      link: '#',
      color: '#764BA2'
    }
  ];

  return (
    <div className="quick-actions">
      <h3 className="actions-title">Quick Actions</h3>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <Link 
            key={index}
            to={action.link}
            className="action-card"
            style={{ borderColor: `${action.color}40` }}
          >
            <div 
              className="action-icon"
              style={{ 
                backgroundColor: `${action.color}20`,
                color: action.color
              }}
            >
              {action.icon}
            </div>
            <div className="action-info">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-desc">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
