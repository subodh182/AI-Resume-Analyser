import React from 'react';
import { FiFileText, FiTrendingUp, FiBriefcase, FiEye } from 'react-icons/fi';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      icon: <FiFileText />,
      title: 'Total Resumes',
      value: stats?.resumeCount || 0,
      color: '#667EEA',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      icon: <FiTrendingUp />,
      title: 'Avg ATS Score',
      value: `${stats?.avgAtsScore || 0}%`,
      color: '#4FACFE',
      bgColor: 'rgba(79, 172, 254, 0.1)'
    },
    {
      icon: <FiBriefcase />,
      title: 'Jobs Applied',
      value: stats?.applicationCount || 0,
      color: '#F093FB',
      bgColor: 'rgba(240, 147, 251, 0.1)'
    },
    {
      icon: <FiEye />,
      title: 'Profile Views',
      value: stats?.profileViews || 0,
      color: '#FEC163',
      bgColor: 'rgba(254, 193, 99, 0.1)'
    }
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="stat-card"
          style={{ borderColor: card.color }}
        >
          <div 
            className="stat-icon"
            style={{ 
              backgroundColor: card.bgColor,
              color: card.color 
            }}
          >
            {card.icon}
          </div>
          <div className="stat-info">
            <h3 className="stat-value">{card.value}</h3>
            <p className="stat-title">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
