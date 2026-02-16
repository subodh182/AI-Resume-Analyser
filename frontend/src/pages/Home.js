import React from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiBarChart2, FiBriefcase, FiZap, FiTarget, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FiUpload />,
      title: 'Upload Resume',
      description: 'Drag and drop your PDF resume for instant analysis'
    },
    {
      icon: <FiBarChart2 />,
      title: 'AI Analysis',
      description: 'Get comprehensive insights on your resume quality'
    },
    {
      icon: <FiTarget />,
      title: 'ATS Score',
      description: 'Check how well your resume performs with ATS systems'
    },
    {
      icon: <FiBriefcase />,
      title: 'Job Matching',
      description: 'Find perfect job matches based on your skills'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Analyzed' },
    { value: '95%', label: 'Success Rate' },
    { value: '500+', label: 'Companies' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge fade-in-up">
            <FiZap /> AI-Powered Career Platform
          </div>
          <h1 className="hero-title fade-in-up">
            Transform Your <span className="gradient-text">Resume</span><br />
            Into Career <span className="gradient-text">Success</span>
          </h1>
          <p className="hero-subtitle fade-in-up">
            Get instant AI-powered analysis, ATS optimization, and personalized job recommendations. 
            Land your dream job with data-driven insights.
          </p>
          <div className="hero-cta fade-in-up">
            <Link to="/register" className="btn btn-primary btn-large">
              <FiUpload /> Analyze Your Resume
            </Link>
            <Link to="/jobs" className="btn btn-outline btn-large">
              <FiBriefcase /> Browse Jobs
            </Link>
          </div>
          
          {/* Stats */}
          <div className="stats-grid fade-in-up">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon"><FiCheckCircle /></div>
            <div className="card-content">
              <div className="card-title">ATS Score</div>
              <div className="card-score">94/100</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon"><FiTrendingUp /></div>
            <div className="card-content">
              <div className="card-title">Match Rate</div>
              <div className="card-score">87%</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon"><FiBriefcase /></div>
            <div className="card-content">
              <div className="card-title">Job Matches</div>
              <div className="card-score">24</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to succeed in your job search</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in three simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3 className="step-title">Upload Resume</h3>
            <p className="step-description">Upload your PDF resume to our secure platform</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">02</div>
            <h3 className="step-title">AI Analysis</h3>
            <p className="step-description">Our AI analyzes and scores your resume instantly</p>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">03</div>
            <h3 className="step-title">Get Matched</h3>
            <p className="step-description">Receive personalized job recommendations</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Boost Your Career?</h2>
          <p className="cta-subtitle">Join thousands of professionals who've improved their resumes with AI</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Get Started Free <FiZap />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
