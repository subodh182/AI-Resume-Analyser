import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiSearch, 
  FiFilter,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [search, typeFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data.jobs || []);
      setFilteredJobs(res.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    setFilteredJobs(filtered);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <h1>Find Your Dream Job</h1>
          <p>Explore {jobs.length} opportunities waiting for you</p>
        </div>

        {/* Search & Filters */}
        <div className="jobs-filters">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search jobs, companies, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <FiFilter />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <FiBriefcase />
            <h2>No jobs found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
                <div className="job-card-header">
                  <div className="company-logo">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  <div className="job-card-info">
                    <h3>{job.title}</h3>
                    <p className="company-name">{job.company}</p>
                  </div>
                  <span className={`job-type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                    {job.type}
                  </span>
                </div>

                <div className="job-card-meta">
                  <span className="meta-item">
                    <FiMapPin /> {job.location}
                  </span>
                  {job.salary?.min && (
                    <span className="meta-item">
                      <FiDollarSign />
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </span>
                  )}
                  <span className="meta-item">
                    <FiCalendar />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="job-card-description">
                  {job.description.substring(0, 150)}
                  {job.description.length > 150 ? '...' : ''}
                </p>

                {job.skills?.length > 0 && (
                  <div className="job-card-skills">
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="skill-tag more">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="job-card-footer">
                  <span className="applicants-count">
                    <FiBriefcase /> {job.applicants?.length || 0} applicants
                  </span>
                  <button className="view-btn">
                    View Details →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;