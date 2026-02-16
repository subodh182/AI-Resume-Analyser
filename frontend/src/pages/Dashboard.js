import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiFileText, FiUpload, FiBarChart2 } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <Link to="/upload-resume" className="btn btn-primary">
            <FiUpload /> Upload New Resume
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <FiFileText />
            <h2>No resumes yet</h2>
            <p>Upload your first resume to get started</p>
            <Link to="/upload-resume" className="btn btn-primary">
              Upload Resume
            </Link>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map(resume => (
              <Link to={`/resume/${resume._id}`} key={resume._id} className="resume-card">
                <div className="resume-icon"><FiFileText /></div>
                <div className="resume-info">
                  <h3>{resume.fileName}</h3>
                  <div className="resume-stats">
                    <span className="badge badge-primary">
                      ATS: {resume.analysis.atsScore}%
                    </span>
                    <span className="badge badge-success">
                      Overall: {resume.analysis.overallScore}%
                    </span>
                  </div>
                  <p>{new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
                <FiBarChart2 className="view-icon" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
