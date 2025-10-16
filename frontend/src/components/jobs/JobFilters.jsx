import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { JOB_TYPES } from '../../utils/constants';

const JobFilters = ({ filters, onChange, onReset, onSearch }) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <TextField
        label="Search"
        placeholder="Title or department"
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        fullWidth
      />

      <TextField
        label="Department"
        placeholder="e.g. Engineering"
        value={filters.department || ''}
        onChange={(e) => onChange({ ...filters, department: e.target.value })}
        fullWidth
      />

      <TextField
        select
        label="Type"
        value={filters.type || ''}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        fullWidth
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value={JOB_TYPES.FULL_TIME}>Full-time</MenuItem>
        <MenuItem value={JOB_TYPES.PART_TIME}>Part-time</MenuItem>
        <MenuItem value={JOB_TYPES.CONTRACT}>Contract</MenuItem>
        <MenuItem value={JOB_TYPES.INTERNSHIP}>Internship</MenuItem>
      </TextField>

      <Button variant="contained" onClick={onSearch}>Search</Button>
      <Button variant="text" onClick={onReset}>Reset</Button>
    </Stack>
  );
};

export default JobFilters;


