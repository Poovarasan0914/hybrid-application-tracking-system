import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Grid, Chip, Stack, Alert } from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import AccessibleButton from '../common/AccessibleButton';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../common/Toast';

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
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Person />
        <Typography variant="h6">My Profile</Typography>
        <Chip 
          label={isProfileComplete ? 'Complete' : 'Incomplete'} 
          color={isProfileComplete ? 'success' : 'warning'} 
          size="small" 
        />
      </Stack>

      {!isProfileComplete && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Please complete your profile to apply for jobs. Missing fields will prevent job applications.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Years of Experience"
                value={profile.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Education"
                value={profile.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="e.g., Bachelor's in Computer Science"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Skills</Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  label="Add Skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <AccessibleButton onClick={addSkill} variant="outlined">Add</AccessibleButton>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {profile.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={profile.resume}
                onChange={(e) => handleInputChange('resume', e.target.value)}
                placeholder="Link to your resume (Google Drive, LinkedIn, etc.)"
              />
            </Grid>
            <Grid item xs={12}>
              <AccessibleButton
                type="submit"
                variant="contained"
                startIcon={<Save />}
                loading={loading}
                fullWidth
              >
                Save Profile
              </AccessibleButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserProfile;