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
              <label><FiMail /> Email</label>
              <p className="form-value">{user?.email}</p>
            </div>
            <div className="form-group">
              <label><FiPhone /> Phone</label>
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
              <label><FiMapPin /> Location</label>
              {editing ? (
                <div className="location-inputs">
                  <input type="text" name="location.city" value={formData.location?.city || ''} onChange={handleChange} placeholder="City" />
                  <input type="text" name="location.state" value={formData.location?.state || ''} onChange={handleChange} placeholder="State" />
                  <input type="text" name="location.country" value={formData.location?.country || ''} onChange={handleChange} placeholder="Country" />
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
                <input type="text" name="currentPosition" value={formData.currentPosition} onChange={handleChange} placeholder="e.g., Senior Software Engineer" />
              ) : (
                <p className="form-value">{user?.currentPosition || 'Not provided'}</p>
              )}
            </div>
            <div className="form-group">
              <label>Current Company</label>
              {editing ? (
                <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} placeholder="e.g., Google" />
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
                      <input type="text" value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} placeholder="Skill name" className="skill-input" />
                      <select value={skill.category} onChange={(e) => handleSkillChange(index, 'category', e.target.value)} className="skill-select">
                        <option value="programming">Programming</option>
                        <option value="frameworks">Frameworks</option>
                        <option value="databases">Databases</option>
                        <option value="cloud">Cloud</option>
                        <option value="tools">Tools</option>
                        <option value="soft_skills">Soft Skills</option>
                      </select>
                      <input type="range" min="1" max="10" value={skill.proficiency} onChange={(e) => handleSkillChange(index, 'proficiency', parseInt(e.target.value))} className="skill-range" />
                      <span className="skill-level">{skill.proficiency}/10</span>
                      <button onClick={() => handleSkillRemove(index)} className="btn-remove"><FiTrash2 /></button>
                    </>
                  ) : (
                    <>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-category">{skill.category}</span>
                      <div className="skill-bar">
                        <div className="skill-bar-fill" style={{ width: `${skill.proficiency * 10}%` }}></div>
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

        {/* Experience Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3 className="section-title">💼 Work Experience</h3>
            {editing && (
              <button onClick={handleExperienceAdd} className="btn-icon">
                <FiPlus /> Add Experience
              </button>
            )}
          </div>
          <div className="experience-list">
            {formData.experience?.length > 0 ? (
              formData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  {editing ? (
                    <div className="experience-form">
                      <div className="form-row">
                        <input type="text" value={exp.position} onChange={(e) => handleExperienceChange(index, 'position', e.target.value)} placeholder="Position" className="form-input" />
                        <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} placeholder="Company" className="form-input" />
                      </div>
                      <div className="form-row">
                        <input type="text" value={exp.location} onChange={(e) => handleExperienceChange(index, 'location', e.target.value)} placeholder="Location" className="form-input" />
                        <select value={exp.employmentType} onChange={(e) => handleExperienceChange(index, 'employmentType', e.target.value)} className="form-select">
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <input type="month" value={exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : ''} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} className="form-input" />
                        {!exp.current && (
                          <input type="month" value={exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : ''} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} className="form-input" />
                        )}
                        <label className="checkbox-label">
                          <input type="checkbox" checked={exp.current} onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)} />
                          Currently Working
                        </label>
                      </div>
                      <textarea value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} placeholder="Job description and achievements..." rows="4" className="form-textarea" />
                      <button onClick={() => handleExperienceRemove(index)} className="btn-remove-large">
                        <FiTrash2 /> Remove Experience
                      </button>
                    </div>
                  ) : (
                    <div className="experience-display">
                      <div className="exp-header">
                        <div>
                          <h4 className="exp-position">{exp.position}</h4>
                          <p className="exp-company">{exp.company}</p>
                        </div>
                        <span className="exp-type">{exp.employmentType}</span>
                      </div>
                      <p className="exp-location"><FiMapPin /> {exp.location}</p>
                      <p className="exp-duration">
                        {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                      {exp.description && <p className="exp-description">{exp.description}</p>}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-text">No experience added yet</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section">
          <div className="section-header">
            <h3 className="section-title">🎓 Education</h3>
            {editing && (
              <button onClick={handleEducationAdd} className="btn-icon">
                <FiPlus /> Add Education
              </button>
            )}
          </div>
          <div className="education-list">
            {formData.education?.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  {editing ? (
                    <div className="education-form">
                      <div className="form-row">
                        <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder="Degree (e.g., B.Tech in Computer Science)" className="form-input" />
                        <input type="text" value={edu.university} onChange={(e) => handleEducationChange(index, 'university', e.target.value)} placeholder="University/College" className="form-input" />
                      </div>
                      <div className="form-row">
                        <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)} placeholder="Field of Study" className="form-input" />
                        <input type="text" value={edu.grade} onChange={(e) => handleEducationChange(index, 'grade', e.target.value)} placeholder="Grade/CGPA" className="form-input" />
                      </div>
                      <div className="form-row">
                        <input type="number" value={edu.startYear} onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)} placeholder="Start Year" min="1950" max="2030" className="form-input" />
                        <input type="number" value={edu.endYear} onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)} placeholder="End Year" min="1950" max="2030" className="form-input" />
                      </div>
                      <button onClick={() => handleEducationRemove(index)} className="btn-remove-large">
                        <FiTrash2 /> Remove Education
                      </button>
                    </div>
                  ) : (
                    <div className="education-display">
                      <h4 className="edu-degree">{edu.degree}</h4>
                      <p className="edu-university">{edu.university}</p>
                      {edu.fieldOfStudy && <p className="edu-field">{edu.fieldOfStudy}</p>}
                      <div className="edu-meta">
                        <span className="edu-year">{edu.startYear} - {edu.endYear}</span>
                        {edu.grade && <span className="edu-grade">Grade: {edu.grade}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-text">No education added yet</p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="profile-section">
          <h3 className="section-title">🔗 Social Links</h3>
          <div className="social-links-grid">
            <div className="form-group">
              <label><FiLinkedin /> LinkedIn</label>
              {editing ? (
                <input type="url" name="socialLinks.linkedin" value={formData.socialLinks?.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" />
              ) : (
                <p className="form-value">
                  {user?.socialLinks?.linkedin ? <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">{user.socialLinks.linkedin}</a> : 'Not provided'}
                </p>
              )}
            </div>
            <div className="form-group">
              <label><FiGithub /> GitHub</label>
              {editing ? (
                <input type="url" name="socialLinks.github" value={formData.socialLinks?.github || ''} onChange={handleChange} placeholder="https://github.com/yourname" />
              ) : (
                <p className="form-value">
                  {user?.socialLinks?.github ? <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">{user.socialLinks.github}</a> : 'Not provided'}
                </p>
              )}
            </div>
            <div className="form-group">
              <label><FiGlobe /> Portfolio</label>
              {editing ? (
                <input type="url" name="socialLinks.portfolio" value={formData.socialLinks?.portfolio || ''} onChange={handleChange} placeholder="https://yourwebsite.com" />
              ) : (
                <p className="form-value">
                  {user?.socialLinks?.portfolio ? <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">{user.socialLinks.portfolio}</a> : 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="profile-section">
          <h3 className="section-title">⚙️ Job Preferences</h3>
          <div className="preferences-grid">
            <div className="form-group">
              <label className="checkbox-label large">
                <input
                  type="checkbox"
                  name="jobPreferences.openToWork"
                  checked={formData.jobPreferences?.openToWork || false}
                  onChange={handleChange}
                  disabled={!editing}
                />
                <span className="checkbox-text">
                  <strong>Open to Work</strong>
                  <small>Let recruiters know you're looking for opportunities</small>
                </span>
              </label>
            </div>

            {editing && (
              <>
                <div className="form-group">
                  <label>Preferred Job Types</label>
                  <div className="checkbox-group">
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(type => (
                      <label key={type} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.jobPreferences?.jobTypes?.includes(type)}
                          onChange={(e) => {
                            const currentTypes = formData.jobPreferences?.jobTypes || [];
                            const newTypes = e.target.checked
                              ? [...currentTypes, type]
                              : currentTypes.filter(t => t !== type);
                            setFormData(prev => ({
                              ...prev,
                              jobPreferences: { ...prev.jobPreferences, jobTypes: newTypes }
                            }));
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="jobPreferences.willingToRelocate" checked={formData.jobPreferences?.willingToRelocate || false} onChange={handleChange} />
                    Willing to Relocate
                  </label>
                </div>
              </>
            )}

            {!editing && user?.jobPreferences?.jobTypes?.length > 0 && (
              <div className="form-group">
                <label>Preferred Job Types</label>
                <div className="tags-display">
                  {user.jobPreferences.jobTypes.map((type, index) => (
                    <span key={index} className="tag">{type}</span>
                  ))}
                </div>
              </div>
            )}

            {!editing && user?.jobPreferences?.willingToRelocate && (
              <div className="form-group">
                <p className="form-value">✅ Willing to Relocate</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
