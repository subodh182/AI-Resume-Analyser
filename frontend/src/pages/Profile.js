import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiCamera
} from 'react-icons/fi';
import { getProfile, updateProfile, uploadProfilePhoto } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: { city: '', state: '', country: '' },
    currentPosition: '',
    currentCompany: '',
    skills: [],
    experience: [],
    education: [],
    socialLinks: { linkedin: '', github: '', portfolio: '' },
    jobPreferences: {
      openToWork: false,
      jobTypes: [],
      preferredLocations: [],
      willingToRelocate: false
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || { city: '', state: '', country: '' },
        currentPosition: userData.currentPosition || '',
        currentCompany: userData.currentCompany || '',
        skills: userData.skills || [],
        experience: userData.experience || [],
        education: userData.education || [],
        socialLinks: userData.socialLinks || { linkedin: '', github: '', portfolio: '' },
        jobPreferences: userData.jobPreferences || {
          openToWork: false,
          jobTypes: [],
          preferredLocations: [],
          willingToRelocate: false
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await uploadProfilePhoto(formData);
      setUser({ ...user, profilePhoto: response.data.photoUrl });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSkillAdd = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', proficiency: 5, category: 'programming' }]
    }));
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skills];
    newSkills[index][field] = value;
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSkillRemove = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleExperienceAdd = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleExperienceRemove = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleEducationAdd = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        university: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        grade: ''
      }]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const handleEducationRemove = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, education: newEducation }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateProfile(formData);
      setUser(response.data.user);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1>Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <div className="edit-buttons">
              <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                <FiX /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Completion */}
        <div className="completion-banner">
          <div className="completion-info">
            <h3>Profile Completion: {user?.profileCompletion || 0}%</h3>
            <div className="completion-bar">
              <div 
                className="completion-fill"
                style={{ width: `${user?.profileCompletion || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="profile-photo-section">
          <div className="photo-container">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                <FiUser />
              </div>
            )}
            {editing && (
              <label className="photo-upload-btn">
                <FiCamera />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          <div className="photo-info">
            <h2>{user?.name || 'Your Name'}</h2>
            <p className="user-role">{user?.currentPosition || 'Add your position'}</p>
            <p className="user-company">{user?.currentCompany || 'Add your company'}</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="profile-section">
          <h3 className="section-title">
            <FiUser /> Basic Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="form-value">{user?.name || 'Not provided'}</p>
              )}
            </div>
            <div className="form-group">
              <label>
                <FiMail /> Email
              </label>
              <p className="form-value">{user?.email}</p>
            </div>
            <div className="form-group">
              <label>
                <FiPhone /> Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              ) : (
                <p className="form-value">{user?.phone || 'Not provided'}</p>
              )}
            </div>
            <div className="form-group">
              <label>
                <FiMapPin /> Location
              </label>
              {editing ? (
                <div className="location-inputs">
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location?.city || ''}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location?.state || ''}
                    onChange={handleChange}
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location?.country || ''}
                    onChange={handleChange}
                    placeholder="Country"
                  />
                </div>
              ) : (
                <p className="form-value">
                  {user?.location?.city && user?.location?.state && user?.location?.country
                    ? `${user.location.city}, ${user.location.state}, ${user.location.country}`
                    : 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="profile-section">
          <h3 className="section-title">
            <FiBriefcase /> Professional Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Position</label>
              {editing ? (
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                />
              ) : (
                <p className="form-value">{user?.currentPosition || 'Not provided'}</p>
              )}
            </div>
            <div className="form-group">
              <label>Current Company</label>
              {editing ? (
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="e.g., Google"
                />
              ) : (
                <p className="form-value">{user?.currentCompany || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="profile-section">
          <div className="section-header">
            <h3 className="section-title">💡 Skills</h3>
            {editing && (
              <button onClick={handleSkillAdd} className="btn-icon">
                <FiPlus /> Add Skill
              </button>
            )}
          </div>
          <div className="skills-list">
            {formData.skills?.length > 0 ? (
              formData.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  {editing ? (
                    <>
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                        placeholder="Skill name"
                        className="skill-input"
                      />
                      <select
                        value={skill.category}
                        onChange={(e) => handleSkillChange(index, 'category', e.target.value)}
                        className="skill-select"
                      >
                        <option value="programming">Programming</option>
                        <option value="frameworks">Frameworks</option>
                        <option value="databases">Databases</option>
                        <option value="cloud">Cloud</option>
                        <option value="tools">Tools</option>
                        <option value="soft_skills">Soft Skills</option>
                      </select>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={skill.proficiency}
                        onChange={(e) => handleSkillChange(index, 'proficiency', parseInt(e.target.value))}
                        className="skill-range"
                      />
                      <span className="skill-level">{skill.proficiency}/10</span>
                      <button 
                        onClick={() => handleSkillRemove(index)}
                        className="btn-remove"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-category">{skill.category}</span>
                      <div className="skill-bar">
                        <div 
                          className="skill-bar-fill"
                          style={{ width: `${skill.proficiency * 10}%` }}
                        ></div>
                      </div>
                      <span className="skill-level">{skill.proficiency}/10</span>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-text">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Continue in next message... */}
      </div>
    </div>
  );
};

export default Profile;
