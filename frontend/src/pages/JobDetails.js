import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiBriefcase, 
  FiClock, 
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiSend
} from 'react-icons/fi';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'user') {
      fetchResumes();
    }
  }, [id, isAuthenticated]);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.resumes);
      if (res.data.resumes.length > 0) {
        setSelectedResume(res.data.resumes[0]._id);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!selectedResume) {
      toast.error('Please select a resume');
      return;
    }

    setApplying(true);
    try {
      await api.post(`/jobs/${id}/apply`, { resumeId: selectedResume });
      toast.success('Application submitted successfully!');
      fetchJobDetails(); // Refresh to show applied status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const hasApplied = () => {
    if (!job || !user) return false;
    return job.applicants?.some(app => app.user.toString() === user.id);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="error-container">
        <h2>Job not found</h2>
        <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">
        <Link to="/jobs" className="back-btn">
          <FiArrowLeft /> Back to Jobs
        </Link>

        <div className="job-header">
          <div className="job-company-logo">
            {job.company.charAt(0).toUpperCase()}
          </div>
          <div className="job-header-info">
            <h1>{job.title}</h1>
            <div className="job-company">{job.company}</div>
            <div className="job-meta">
              <span className="job-meta-item">
                <FiMapPin /> {job.location}
              </span>
              <span className="job-meta-item">
                <FiBriefcase /> {job.type}
              </span>
              <span className="job-meta-item">
                <FiCalendar /> Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          {job.salary?.min && (
            <div className="job-salary">
              <FiDollarSign />
              <div>
                <div className="salary-range">
                  ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                </div>
                <div className="salary-label">per year</div>
              </div>
            </div>
          )}
        </div>

        <div className="job-content">
          <div className="job-main">
            <section className="job-section">
              <h2>Job Description</h2>
              <p className="job-description">{job.description}</p>
            </section>

            {job.requirements?.length > 0 && (
              <section className="job-section">
                <h2>Requirements</h2>
                <ul className="requirements-list">
                  {job.requirements.map((req, index) => (
                    <li key={index}>
                      <FiCheckCircle /> {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.skills?.length > 0 && (
              <section className="job-section">
                <h2>Required Skills</h2>
                <div className="skills-list">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {job.experience && (
              <section className="job-section">
                <h2>Experience Required</h2>
                <p className="experience-range">
                  <FiClock /> {job.experience.min} - {job.experience.max} years
                </p>
              </section>
            )}
          </div>

          <div className="job-sidebar">
            <div className="apply-card">
              <h3>Apply for this position</h3>
              
              {!isAuthenticated ? (
                <div className="no-auth-message">
                  <p>Please login to apply for this job</p>
                  <Link to="/login" className="btn btn-primary btn-full">
                    Login
                  </Link>
                </div>
              ) : hasApplied() ? (
                <div className="applied-message">
                  <FiCheckCircle />
                  <p>You have already applied to this job</p>
                </div>
              ) : user?.role === 'user' ? (
                <>
                  {resumes.length === 0 ? (
                    <div className="no-resume-message">
                      <p>Please upload a resume first</p>
                      <Link to="/upload-resume" className="btn btn-secondary">
                        Upload Resume
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="input-group">
                        <label>Select Resume</label>
                        <select 
                          value={selectedResume}
                          onChange={(e) => setSelectedResume(e.target.value)}
                        >
                          {resumes.map(resume => (
                            <option key={resume._id} value={resume._id}>
                              {resume.fileName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="btn btn-primary btn-full"
                        onClick={handleApply}
                        disabled={applying}
                      >
                        {applying ? 'Submitting...' : <><FiSend /> Apply Now</>}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="recruiter-message">
                  <p>Recruiters cannot apply to jobs</p>
                </div>
              )}
            </div>

            <div className="job-stats-card">
              <h3>Job Statistics</h3>
              <div className="stat-item">
                <FiUser />
                <div>
                  <div className="stat-value">{job.applicants?.length || 0}</div>
                  <div className="stat-label">Applicants</div>
                </div>
              </div>
              <div className="stat-item">
                <FiClock />
                <div>
                  <div className="stat-value">{job.views || 0}</div>
                  <div className="stat-label">Views</div>
                </div>
              </div>
              <div className="stat-item">
                <span className={`status-badge ${job.status}`}>
                  {job.status}
                </span>
              </div>
            </div>

            {job.postedBy && (
              <div className="recruiter-card">
                <h3>Posted By</h3>
                <div className="recruiter-info">
                  <div className="recruiter-avatar">
                    {job.postedBy.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="recruiter-name">{job.postedBy.name}</div>
                    <div className="recruiter-email">{job.postedBy.email}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;