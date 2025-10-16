import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, MenuItem, TextField, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Collapse, IconButton } from '@mui/material';
import { Comment, Edit, ExpandMore, ExpandLess, Person } from '@mui/icons-material';
import ApplicationStatus from '../applications/ApplicationStatus';
import SkeletonLoader from '../common/SkeletonLoader';
import AccessibleButton from '../common/AccessibleButton';
import { useToast } from '../common/Toast';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteDialog, setNoteDialog] = useState({ open: false, appId: null, note: '' });
  const [statusDialog, setStatusDialog] = useState({ open: false, appId: null, status: '', comment: '' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { success, error: showError } = useToast();

  const toggleRowExpansion = (appId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedRows(newExpanded);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getNonTechnicalApplications({ 
        status: filter || undefined,
        roleCategory: roleFilter,
        page: 1, 
        limit: 50 
      });
      setApplications(data.applications || []);
      setError('');
    } catch (err) {
      console.error('Load error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load applications';
      setError(errorMsg);
      showError(errorMsg);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, roleFilter]);

  const handleUpdateStatus = async () => {
    try {
      await adminService.updateApplicationStatus(
        statusDialog.appId, 
        statusDialog.status, 
        statusDialog.comment
      );
      setStatusDialog({ open: false, appId: null, status: '', comment: '' });
      success('Application status updated successfully');
      await load();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleAddNote = async () => {
    try {
      await adminService.addApplicationNote(noteDialog.appId, noteDialog.note);
      setNoteDialog({ open: false, appId: null, note: '' });
      success('Note added successfully');
      await load();
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add note';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h6">Application Management</Typography>
        <Stack direction="row" spacing={2}>
          <TextField select size="small" label="Role Type" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} sx={{ minWidth: 180 }}>
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="technical">Technical Only</MenuItem>
            <MenuItem value="non-technical">Non-Technical Only</MenuItem>
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
        <strong>Admin Role:</strong> Full management for non-technical roles. For technical roles, you can only accept/reject applications that have been shortlisted by the bot.
      </Alert>

      {loading ? (
        <SkeletonLoader variant="table" count={5} />
      ) : (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Job & Role Type</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Profile</TableCell>
                <TableCell align="center">Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map(a => (
                <>
                  <TableRow key={a._id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
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
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(a._id)}
                        aria-label="View profile details"
                      >
                        <Person />
                        {expandedRows.has(a._id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {a.jobId?.roleCategory === 'non-technical' && (
                        <AccessibleButton
                          size="small"
                          startIcon={<Comment />}
                          onClick={() => setNoteDialog({ open: true, appId: a._id, note: '' })}
                          variant="outlined"
                          ariaLabel={`Add note to application for ${a.jobId?.title}`}
                        >
                          Add Note
                        </AccessibleButton>
                      )}
                      {a.jobId?.roleCategory === 'technical' && (
                        <Typography variant="body2" color="text.secondary">Bot Managed</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {a.jobId?.roleCategory === 'non-technical' ? (
                        <AccessibleButton
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => setStatusDialog({ open: true, appId: a._id, status: a.status, comment: '' })}
                          variant="contained"
                          color="primary"
                          ariaLabel={`Update status for application to ${a.jobId?.title}`}
                        >
                          Update Status
                        </AccessibleButton>
                      ) : a.status === 'shortlisted' ? (
                        <Stack direction="row" spacing={1}>
                          <AccessibleButton
                            size="small"
                            onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'accepted', comment: '' })}
                            variant="contained"
                            color="success"
                            ariaLabel={`Accept application for ${a.jobId?.title}`}
                          >
                            Accept
                          </AccessibleButton>
                          <AccessibleButton
                            size="small"
                            onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'rejected', comment: '' })}
                            variant="contained"
                            color="error"
                            ariaLabel={`Reject application for ${a.jobId?.title}`}
                          >
                            Reject
                          </AccessibleButton>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {a.status === 'accepted' ? 'Accepted' : a.status === 'rejected' ? 'Rejected' : 'Bot Processing'}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0 }}>
                      <Collapse in={expandedRows.has(a._id)} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Applicant Profile Details</Typography>
                          {a.applicantId?.profile ? (
                            <Stack spacing={1}>
                              <Typography variant="body2"><strong>Name:</strong> {a.applicantId.profile.firstName} {a.applicantId.profile.lastName}</Typography>
                              <Typography variant="body2"><strong>Phone:</strong> {a.applicantId.profile.phone || 'Not provided'}</Typography>
                              <Typography variant="body2"><strong>Experience:</strong> {a.applicantId.profile.experience || 0} years</Typography>
                              <Typography variant="body2"><strong>Education:</strong> {a.applicantId.profile.education || 'Not provided'}</Typography>
                              <Typography variant="body2"><strong>Address:</strong> {a.applicantId.profile.address || 'Not provided'}</Typography>
                              {a.applicantId.profile.skills?.length > 0 && (
                                <Box>
                                  <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Skills:</strong></Typography>
                                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                    {a.applicantId.profile.skills.map((skill, idx) => (
                                      <Chip key={idx} label={skill} size="small" variant="outlined" />
                                    ))}
                                  </Stack>
                                </Box>
                              )}
                              {a.applicantId.profile.resume && (
                                <Typography variant="body2">
                                  <strong>Resume:</strong> <a href={a.applicantId.profile.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
                                </Typography>
                              )}
                            </Stack>
                          ) : (
                            <Alert severity="warning" size="small">Profile not completed by applicant</Alert>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

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
          <AccessibleButton onClick={() => setNoteDialog({ open: false, appId: null, note: '' })} ariaLabel="Cancel adding note">Cancel</AccessibleButton>
          <AccessibleButton onClick={handleAddNote} variant="contained" disabled={!noteDialog.note.trim()} ariaLabel="Confirm add note">Add Note</AccessibleButton>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog.open} onClose={() => setStatusDialog({ open: false, appId: null, status: '', comment: '' })} maxWidth="sm" fullWidth>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              label="New Status"
              value={statusDialog.status}
              onChange={(e) => setStatusDialog({ ...statusDialog, status: e.target.value })}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewing">Reviewing</MenuItem>
              <MenuItem value="shortlisted">Shortlisted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comment (Optional)"
              value={statusDialog.comment}
              onChange={(e) => setStatusDialog({ ...statusDialog, comment: e.target.value })}
              placeholder="Add a comment about this status change..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <AccessibleButton onClick={() => setStatusDialog({ open: false, appId: null, status: '', comment: '' })} ariaLabel="Cancel status update">Cancel</AccessibleButton>
          <AccessibleButton onClick={handleUpdateStatus} variant="contained" disabled={!statusDialog.status} ariaLabel="Confirm status update">Update Status</AccessibleButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationManagement;


