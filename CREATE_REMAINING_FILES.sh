#!/bin/bash

# Create Dashboard page
cat > frontend/src/pages/Dashboard.js << 'EOFDASH'
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
EOFDASH

# Create Dashboard CSS
cat > frontend/src/pages/Dashboard.css << 'EOFDASHS'
.dashboard-page {
  min-height: 100vh;
  padding: 40px 20px;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-size: 42px;
  font-weight: 800;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state svg {
  font-size: 80px;
  color: var(--gray);
  margin-bottom: 24px;
}

.empty-state h2 {
  font-size: 28px;
  margin-bottom: 12px;
}

.empty-state p {
  color: var(--gray);
  margin-bottom: 32px;
}

.resumes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.resume-card {
  background: linear-gradient(135deg, rgba(31, 31, 31, 0.8), rgba(15, 15, 15, 0.9));
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.resume-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 12px 48px var(--shadow);
}

.resume-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 12px;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.resume-info {
  flex: 1;
}

.resume-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resume-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.resume-info p {
  font-size: 13px;
  color: var(--gray);
}

.view-icon {
  font-size: 24px;
  color: var(--gray);
  flex-shrink: 0;
}
EOFDASHS

# Create other essential pages
cat > frontend/src/pages/UploadResume.js << 'EOFUP'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import './UploadResume.css';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resume uploaded successfully!');
      navigate(`/resume/${res.data.resume._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Your Resume</h1>
        <p className="upload-subtitle">Upload your PDF resume for AI-powered analysis</p>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-upload-area">
            <input
              type="file"
              id="file-input"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="file-upload-label">
              {file ? (
                <>
                  <FiFileText />
                  <span>{file.name}</span>
                  <p>Click to change file</p>
                </>
              ) : (
                <>
                  <FiUploadCloud />
                  <span>Click to upload or drag and drop</span>
                  <p>PDF files only (Max 5MB)</p>
                </>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!file || uploading}
          >
            {uploading ? 'Analyzing...' : 'Upload & Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
EOFUP

# Create remaining placeholder pages
for page in ResumeAnalysis Jobs JobDetails Profile NotFound; do
  cat > frontend/src/pages/${page}.js << EOFPAGE
import React from 'react';

const ${page} = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '80px 20px', textAlign: 'center' }}>
      <h1>${page} Page</h1>
      <p>This page is under construction</p>
    </div>
  );
};

export default ${page};
EOFPAGE
done

# Create UploadResume CSS
cat > frontend/src/pages/UploadResume.css << 'EOFUPC'
.upload-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.upload-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.upload-container h1 {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 12px;
}

.upload-subtitle {
  font-size: 16px;
  color: var(--gray);
  margin-bottom: 48px;
}

.upload-form {
  background: linear-gradient(135deg, rgba(31, 31, 31, 0.8), rgba(15, 15, 15, 0.9));
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 48px;
}

.file-upload-area {
  margin-bottom: 32px;
}

.file-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  border-color: var(--primary);
  background: rgba(255, 51, 102, 0.05);
}

.file-upload-label svg {
  font-size: 64px;
  color: var(--primary);
  margin-bottom: 16px;
}

.file-upload-label span {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.file-upload-label p {
  font-size: 14px;
  color: var(--gray);
}
EOFUPC

echo "Files created successfully!"
