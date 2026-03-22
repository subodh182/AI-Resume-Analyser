import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiBriefcase, FiFileText, FiTarget, FiEdit, FiLayers, FiMessageCircle } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">ResumePro</span>
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              <FiHome /> Home
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/jobs" className="nav-link" onClick={() => setIsOpen(false)}>
              <FiBriefcase /> Jobs
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                  <FiFileText /> Dashboard
                </Link>
              </li>

              {/* AI Tools Dropdown */}
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <span className="nav-link dropdown-toggle">
                  AI Tools ▾
                </span>
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/job-match" className="dropdown-link" onClick={() => setIsOpen(false)}>
                        <FiTarget /> Job Match
                      </Link>
                    </li>
                    <li>
                      <Link to="/resume-summary" className="dropdown-link" onClick={() => setIsOpen(false)}>
                        <FiEdit /> Summary Generator
                      </Link>
                    </li>
                    <li>
                      <Link to="/resume-ranking" className="dropdown-link" onClick={() => setIsOpen(false)}>
                        <FiLayers /> Resume Ranking
                      </Link>
                    </li>
                    <li>
                      <Link to="/interview-questions" className="dropdown-link" onClick={() => setIsOpen(false)}>
                        <FiMessageCircle /> Interview Prep
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setIsOpen(false)}>
                  <FiUser /> Profile
                </Link>
              </li>
              
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <FiLogOut /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary nav-btn" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
