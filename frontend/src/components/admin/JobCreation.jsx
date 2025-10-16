import { useState } from 'react';
import { adminService } from '../../services/adminService';
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

  const commonStyles = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px'
  };

  const inputStyle = {
    ...commonStyles,
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '16px'
  };

  const buttonStyle = {
    ...commonStyles,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: 'white'
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#1976d2',
    border: '1px solid #1976d2'
  };

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
    <div style={{ padding: '20px', ...commonStyles }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ fontSize: '20px' }}>💼</span>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Create New Job Role</h2>
        <span style={{ 
          padding: '4px 12px', 
          backgroundColor: formData.roleCategory === 'technical' ? '#1976d2' : '#9c27b0', 
          color: 'white', 
          borderRadius: '16px', 
          fontSize: '12px' 
        }}>
          {formData.roleCategory === 'technical' ? 'Technical' : 'Non-Technical'}
        </span>
      </div>

      {message && (
        <div style={{ padding: '12px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', color: '#155724', marginBottom: '16px', ...commonStyles }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', color: '#721c24', marginBottom: '16px', ...commonStyles }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Job Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Role Category *</label>
              <select
                value={formData.roleCategory}
                onChange={(e) => handleInputChange('roleCategory', e.target.value)}
                required
                style={inputStyle}
              >
                <option value="technical">Technical</option>
                <option value="non-technical">Non-Technical</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Job Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={inputStyle}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Minimum Salary *</label>
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => handleInputChange('salary.min', e.target.value)}
                required
                placeholder="50000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Maximum Salary *</label>
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => handleInputChange('salary.max', e.target.value)}
                required
                placeholder="80000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', ...commonStyles }}>Application Deadline *</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', fontSize: '16px', ...commonStyles }}>Requirements</label>
            {formData.requirements.map((req, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                {formData.requirements.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeRequirement(index)}
                    style={{ ...secondaryButton, backgroundColor: '#f44336', color: 'white', padding: '12px' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              onClick={addRequirement}
              style={{ ...secondaryButton, marginBottom: '16px' }}
            >
              ➕ Add Requirement
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                ...primaryButton, 
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : 'Create Job Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobCreation;