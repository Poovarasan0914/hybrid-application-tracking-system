import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, MenuItem, Chip, Box, Stack
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AccessibleButton from './AccessibleButton';

const AdvancedSearch = ({ open, onClose, onSearch, searchType = 'applications' }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    department: '',
    jobType: '',
    dateFrom: null,
    dateTo: '',
    roleCategory: '',
    tags: []
  });

  const statusOptions = ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'];
  const departmentOptions = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const jobTypeOptions = ['full-time', 'part-time', 'contract', 'internship'];
  const roleCategoryOptions = ['technical', 'non-technical'];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tag) => {
    if (tag && !filters.tags.includes(tag)) {
      setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      status: '',
      department: '',
      jobType: '',
      dateFrom: null,
      dateTo: '',
      roleCategory: '',
      tags: []
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Advanced Search & Filters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keyword Search"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="Search in titles, descriptions, names..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departmentOptions.map(dept => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Job Type"
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {jobTypeOptions.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role Category"
                value={filters.roleCategory}
                onChange={(e) => handleFilterChange('roleCategory', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {roleCategoryOptions.map(category => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date From"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date To"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Tags"
                placeholder="Press Enter to add tags"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Box sx={{ mt: 1 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {filters.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => removeTag(tag)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <AccessibleButton onClick={clearFilters} ariaLabel="Clear all filters">
            Clear
          </AccessibleButton>
          <AccessibleButton onClick={onClose} ariaLabel="Cancel search">
            Cancel
          </AccessibleButton>
          <AccessibleButton onClick={handleSearch} variant="contained" ariaLabel="Apply search filters">
            Search
          </AccessibleButton>
        </DialogActions>
      </Dialog>
  );
};

export default AdvancedSearch;