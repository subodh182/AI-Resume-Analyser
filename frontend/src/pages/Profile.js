import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiBriefcase, FiSave } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    location: '',
    bio: '',
    skills: [],
    experience: '',
    education: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      const userData = res.data.user;
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        location: userData.location || '',
        bio: userData.bio || '',
        skills: userData.skills || [],
        experience: userData.experience || '',
        education: userData.education || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{formData.name}</h1>
            <p className="profile-email">{formData.email}</p>
            <span className={`role-badge ${user?.role}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2><FiUser /> Personal Information</h2>
            <div className="form-grid">
              <div className="input-group">
                <label><FiUser /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="input-group">
                <label><FiMail /> Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="input-group">
                <label><FiPhone /> Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="input-group">
                <label><FiMapPin /> Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="New York, USA"
                />
              </div>
            </div>

            <div className="input-group">
              <label><FiBookOpen /> Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h2><FiBriefcase /> Skills</h2>
            <div className="skills-input-container">
              <div className="input-group">
                <label>Add Skill</label>
                <div className="skill-input-wrapper">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., JavaScript, Python, React"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="btn btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="skills-list">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="remove-skill"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="empty-message">No skills added yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2><FiBriefcase /> Professional Details</h2>
            <div className="input-group">
              <label>Experience</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your work experience..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label><FiBookOpen /> Education</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Your educational background..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              disabled={updating}
            >
              {updating ? 'Updating...' : <><FiSave /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;