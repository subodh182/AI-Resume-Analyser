import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiUpload, FiBarChart2, FiBriefcase } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">AI</div>
          <span className="logo-text">Resume<span className="accent">Pro</span></span>
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/jobs" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
            <FiBriefcase /> Jobs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FiBarChart2 /> Dashboard
              </Link>
              <Link to="/upload-resume" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FiUpload /> Upload Resume
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                <FiUser /> Profile
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
              <div className="user-badge">
                <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                <span className="user-name">{user?.name}</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
