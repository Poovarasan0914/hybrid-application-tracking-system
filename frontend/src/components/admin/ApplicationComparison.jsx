import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography,
  Grid, Paper, Chip, Table, TableHead, TableRow, TableCell, TableBody,
  Rating, LinearProgress, Stack, Divider
} from '@mui/material';
import { Compare, Star, Timeline, Person } from '@mui/icons-material';
import AccessibleButton from '../common/AccessibleButton';

const ApplicationComparison = ({ open, onClose, applications = [] }) => {
  const [selectedApps, setSelectedApps] = useState([]);

  const compareFields = [
    { key: 'applicantId.username', label: 'Applicant Name', type: 'text' },
    { key: 'applicantId.email', label: 'Email', type: 'text' },
    { key: 'jobId.title', label: 'Job Title', type: 'text' },
    { key: 'jobId.department', label: 'Department', type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'submittedAt', label: 'Applied Date', type: 'date' },
    { key: 'notes.length', label: 'Notes Count', type: 'number' },
    { key: 'score', label: 'Score', type: 'rating' }
  ];

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const formatValue = (value, type) => {
    switch (type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString() : 'N/A';
      case 'status':
        return (
          <Chip 
            label={value || 'Unknown'} 
            size="small" 
            color={value === 'accepted' ? 'success' : 'default'}
          />
        );
      case 'rating':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating value={value || 0} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {value || 0}/5
            </Typography>
          </Box>
        );
      case 'number':
        return value || 0;
      default:
        return value || 'N/A';
    }
  };

  const calculateScore = (app) => {
    // Mock scoring algorithm
    let score = 0;
    if (app.status === 'accepted') score += 5;
    else if (app.status === 'shortlisted') score += 4;
    else if (app.status === 'reviewing') score += 3;
    else if (app.status === 'pending') score += 2;
    
    score += Math.min(app.notes?.length || 0, 3); // Max 3 points for notes
    return Math.min(score, 5);
  };

  const enhancedApplications = applications.map(app => ({
    ...app,
    score: calculateScore(app)
  }));

  const selectApplication = (app) => {
    if (selectedApps.find(selected => selected._id === app._id)) {
      setSelectedApps(prev => prev.filter(selected => selected._id !== app._id));
    } else if (selectedApps.length < 3) {
      setSelectedApps(prev => [...prev, app]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Compare />
          <Typography variant="h6">Application Comparison</Typography>
          <Chip 
            label={`${selectedApps.length}/3 selected`} 
            size="small" 
            color={selectedApps.length > 1 ? 'primary' : 'default'}
          />
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        {selectedApps.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Select applications to compare
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose up to 3 applications from the list below
            </Typography>
          </Box>
        )}

        {/* Application Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Available Applications</Typography>
          <Grid container spacing={1}>
            {enhancedApplications.slice(0, 6).map((app) => (
              <Grid item xs={12} sm={6} md={4} key={app._id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: selectedApps.find(s => s._id === app._id) ? 2 : 1,
                    borderColor: selectedApps.find(s => s._id === app._id) ? 'primary.main' : 'divider',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                  onClick={() => selectApplication(app)}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {app.jobId?.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {app.applicantId?.username}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Rating value={app.score} readOnly size="small" />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Comparison Table */}
        {selectedApps.length > 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Comparison Results</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  {selectedApps.map((app, index) => (
                    <TableCell key={app._id}>
                      <Stack alignItems="center">
                        <Person />
                        <Typography variant="caption">
                          {app.applicantId?.username}
                        </Typography>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {compareFields.map((field) => (
                  <TableRow key={field.key}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {field.label}
                      </Typography>
                    </TableCell>
                    {selectedApps.map((app) => (
                      <TableCell key={app._id}>
                        {formatValue(getNestedValue(app, field.key), field.type)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Divider sx={{ my: 3 }} />

            {/* Score Comparison */}
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Overall Score Comparison</Typography>
            <Grid container spacing={2}>
              {selectedApps.map((app) => (
                <Grid item xs={12} sm={4} key={app._id}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {app.applicantId?.username}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(app.score / 5) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="h6" color="primary">
                      {app.score}/5
                    </Typography>
                    <Rating value={app.score} readOnly size="small" />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <AccessibleButton 
          onClick={() => setSelectedApps([])} 
          disabled={selectedApps.length === 0}
          ariaLabel="Clear selection"
        >
          Clear Selection
        </AccessibleButton>
        <AccessibleButton onClick={onClose} ariaLabel="Close comparison">
          Close
        </AccessibleButton>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationComparison;