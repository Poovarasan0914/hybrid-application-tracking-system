import { useState } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Box, Typography, Paper, TextField, Grid, MenuItem, 
  Alert, Stack, Chip, InputAdornment 
} from '@mui/material';
import { Add, Work } from '@mui/icons-material';
import AccessibleButton from '../common/AccessibleButton';
import { useToast } from '../common/Toast';

const JobCreation = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    requirements: [''],
    roleCategory: 'non-technical',
    type: 'full-time',
    location: '',
    salary: { min: '', max: '', currency: 'USD' },
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { success, error: showError } = useToast();

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: newRequirements }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Filter out empty requirements
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        salary: {
          min: parseFloat(formData.salary.min),
          max: parseFloat(formData.salary.max),
          currency: formData.salary.currency
        }
      };

      const result = await adminService.createJobRole(cleanedData);
      setMessage('Job role created successfully!');
      success('Job role created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        department: '',
        description: '',
        requirements: [''],
        roleCategory: 'non-technical',
        type: 'full-time',
        location: '',
        salary: { min: '', max: '', currency: 'USD' },
        deadline: ''
      });

      if (onJobCreated) onJobCreated(result.job);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create job role';
      setError(errorMsg);
      showError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Work />
        <Typography variant="h6">Create New Job Role</Typography>
        <Chip label="Non-Technical" color="secondary" size="small" />
      </Stack>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Job Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Job Type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <MenuItem value="full-time">Full Time</MenuItem>
                <MenuItem value="part-time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Salary"
                value={formData.salary.min}
                onChange={(e) => handleInputChange('salary.min', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Salary"
                value={formData.salary.max}
                onChange={(e) => handleInputChange('salary.max', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Application Deadline"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Requirements</Typography>
              {formData.requirements.map((req, index) => (
                <Stack key={index} direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Requirement ${index + 1}`}
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <AccessibleButton 
                      onClick={() => removeRequirement(index)} 
                      color="error"
                      ariaLabel={`Remove requirement ${index + 1}`}
                    >
                      Remove
                    </AccessibleButton>
                  )}
                </Stack>
              ))}
              <AccessibleButton 
                startIcon={<Add />} 
                onClick={addRequirement} 
                variant="outlined" 
                size="small"
                ariaLabel="Add new requirement field"
              >
                Add Requirement
              </AccessibleButton>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <AccessibleButton 
                  type="submit" 
                  variant="contained" 
                  loading={loading}
                  ariaLabel="Create new job role"
                >
                  Create Job Role
                </AccessibleButton>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default JobCreation;