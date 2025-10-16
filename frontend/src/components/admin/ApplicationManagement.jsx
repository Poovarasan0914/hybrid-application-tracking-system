import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, MenuItem, TextField, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { Comment, Edit, GetApp, Search } from '@mui/icons-material';
import ApplicationStatus from '../applications/ApplicationStatus';
import SkeletonLoader from '../common/SkeletonLoader';
import AccessibleButton from '../common/AccessibleButton';
import { useToast } from '../common/Toast';
import BulkOperations from './BulkOperations';
import { exportService } from '../../services/exportService';
import AdvancedSearch from '../common/AdvancedSearch';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('non-technical');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteDialog, setNoteDialog] = useState({ open: false, appId: null, note: '' });
  const [statusDialog, setStatusDialog] = useState({ open: false, appId: null, status: '', comment: '' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [viewMode, setViewMode] = useState(0); // 0: table, 1: bulk operations
  const { success, error: showError } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getNonTechnicalApplications({ 
        status: filter || undefined, 
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

  const handleExport = () => {
    exportService.exportToExcel(applications, 'application_management');
    success('Applications exported to Excel');
  };

  const handleSearch = (filters) => {
    console.log('Advanced search:', filters);
    success('Advanced search applied');
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h6">Application Management - Non-Technical Roles</Typography>
        <Stack direction="row" spacing={2}>
          <AccessibleButton
            startIcon={<Search />}
            onClick={() => setSearchOpen(true)}
            variant="outlined"
            size="small"
            ariaLabel="Advanced search"
          >
            Advanced Search
          </AccessibleButton>
          <AccessibleButton
            startIcon={<GetApp />}
            onClick={handleExport}
            variant="outlined"
            size="small"
            ariaLabel="Export applications"
          >
            Export
          </AccessibleButton>
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

      <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)} sx={{ mb: 2 }}>
        <Tab label="Table View" />
        <Tab label="Bulk Operations" />
      </Tabs>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Admin Role:</strong> You can only manage non-technical applications. Technical roles are automatically handled by the bot system.
      </Alert>

      {loading ? (
        <SkeletonLoader variant="table" count={5} />
      ) : (
        <>
          {viewMode === 0 ? (
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
                        <AccessibleButton
                          size="small"
                          startIcon={<Comment />}
                          onClick={() => setNoteDialog({ open: true, appId: a._id, note: '' })}
                          variant="outlined"
                          ariaLabel={`Add note to application for ${a.jobId?.title}`}
                        >
                          Add Note
                        </AccessibleButton>
                      </TableCell>
                      <TableCell align="right">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          ) : (
            <BulkOperations applications={applications} onRefresh={load} />
          )}
        </>
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

      {/* Advanced Search Dialog */}
      <AdvancedSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
        searchType="applications"
      />
    </Box>
  );
};

export default ApplicationManagement;


