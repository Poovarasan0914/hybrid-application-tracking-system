import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, MenuItem, TextField, Button, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Comment } from '@mui/icons-material';
import ApplicationStatus from '../applications/ApplicationStatus';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('non-technical');
  const [error, setError] = useState('');
  const [noteDialog, setNoteDialog] = useState({ open: false, appId: null, note: '' });

  const load = async () => {
    try {
      let data;
      if (roleFilter === 'non-technical') {
        data = await applicationService.getAllApplications({ status: filter || undefined, roleType: 'non-technical', page: 1, limit: 50 });
      } else {
        data = await applicationService.getAllApplications({ status: filter || undefined, page: 1, limit: 50 });
      }
      setApplications(data.applications || []);
      setError('');
    } catch (err) {
      console.error('Load error:', err);
      setError(err.response?.data?.message || 'Failed to load applications');
    }
  };

  useEffect(() => { load(); }, [filter, roleFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await applicationService.updateApplicationStatus(id, status);
      await load();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddNote = async () => {
    try {
      await applicationService.addApplicationNote(noteDialog.appId, noteDialog.note);
      setNoteDialog({ open: false, appId: null, note: '' });
      await load();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h6">Application Management - Non-Technical Roles</Typography>
        <Stack direction="row" spacing={2}>
          <TextField select size="small" label="Role Type" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="non-technical">Non-Technical Only</MenuItem>
            <MenuItem value="all">All Roles</MenuItem>
          </TextField>
          <TextField select size="small" label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewing">Reviewing</MenuItem>
            <MenuItem value="shortlisted">Shortlisted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
          </TextField>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Admin Role:</strong> You can only manage non-technical applications. Technical roles are automatically handled by the bot system.
      </Alert>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job & Role Type</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(a => (
              <TableRow key={a._id} hover>
                <TableCell>
                  <Stack>
                    <Typography variant="body2">{a.jobId?.title}</Typography>
                    <Chip 
                      size="small" 
                      label={a.jobId?.roleCategory || 'unknown'} 
                      color={a.jobId?.roleCategory === 'technical' ? 'primary' : 'secondary'}
                      variant="outlined"
                    />
                  </Stack>
                </TableCell>
                <TableCell>{a.applicantId?.username} ({a.applicantId?.email})</TableCell>
                <TableCell><ApplicationStatus status={a.status} /></TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    startIcon={<Comment />}
                    onClick={() => setNoteDialog({ open: true, appId: a._id, note: '' })}
                    variant="outlined"
                  >
                    Add Note
                  </Button>
                </TableCell>
                <TableCell align="right">
                  {a.jobId?.roleCategory === 'technical' ? (
                    <Chip label="Bot Managed" color="primary" size="small" />
                  ) : (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => handleUpdateStatus(a._id, 'reviewing')}>Reviewing</Button>
                      <Button size="small" onClick={() => handleUpdateStatus(a._id, 'shortlisted')}>Shortlist</Button>
                      <Button size="small" color="error" onClick={() => handleUpdateStatus(a._id, 'rejected')}>Reject</Button>
                      <Button size="small" color="success" onClick={() => handleUpdateStatus(a._id, 'accepted')}>Accept</Button>
                    </Stack>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={noteDialog.open} onClose={() => setNoteDialog({ open: false, appId: null, note: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Add Note to Application</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Note"
            value={noteDialog.note}
            onChange={(e) => setNoteDialog({ ...noteDialog, note: e.target.value })}
            placeholder="Add a note that will be visible to the applicant..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialog({ open: false, appId: null, note: '' })}>Cancel</Button>
          <Button onClick={handleAddNote} variant="contained" disabled={!noteDialog.note.trim()}>Add Note</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationManagement;


