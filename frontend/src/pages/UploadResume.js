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
