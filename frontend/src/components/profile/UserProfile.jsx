import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../common/Toast';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    experience: '',
    skills: [],
    education: '',
    resume: ''
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setProfile({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        phone: user.profile.phone || '',
        address: user.profile.address || '',
        experience: user.profile.experience || '',
        skills: user.profile.skills || [],
        education: user.profile.education || '',
        resume: user.profile.resume || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(profile);
      success('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
    }
    setLoading(false);
  };

  const isProfileComplete = profile.firstName && profile.lastName && profile.phone && 
                           profile.experience !== '' && profile.skills.length > 0;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-title">
          <svg className="header-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <h1>My Profile</h1>
        </div>
        <div className={`status-badge ${isProfileComplete ? 'complete' : 'incomplete'}`}>
          {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
        </div>
      </div>

      {!isProfileComplete && (
        <div className="alert alert-warning">
          Please complete your profile to apply for jobs. Missing fields will prevent job applications.
        </div>
      )}

      <div className="profile-form-container">
        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2 className="section-title">Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  placeholder="Enter your first name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  placeholder="Enter your last name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                  type="number"
                  id="experience"
                  value={profile.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  required
                  placeholder="Enter years of experience"
                />
              </div>
              <div className="form-group">
                <label htmlFor="education">Education</label>
                <input
                  type="text"
                  id="education"
                  value={profile.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g., Bachelor's in Computer Science"
                />
              </div>
              <div className="form-group">
                <label htmlFor="resume">Resume URL</label>
                <input
                  type="url"
                  id="resume"
                  value={profile.resume}
                  onChange={(e) => handleInputChange('resume', e.target.value)}
                  placeholder="Link to your resume (Google Drive, LinkedIn, etc.)"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows="2"
                placeholder="Enter your address"
              ></textarea>
            </div>

            <h2 className="section-title">Skills</h2>

            <div className="form-group">
              <label>Skills</label>
              <div className="skills-input">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter"
                />
                <button 
                  type="button"
                  onClick={addSkill} 
                  className="btn-add-skill"
                >
                  Add
                </button>
              </div>
              <div className="skills-container">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {profile.skills.length === 0 && (
                  <p className="no-skills">No skills added yet</p>
                )}
              </div>
            </div>

            

            <div className="form-submit">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
          </form>
        </div>
      </div>

  );
};

export default UserProfile;