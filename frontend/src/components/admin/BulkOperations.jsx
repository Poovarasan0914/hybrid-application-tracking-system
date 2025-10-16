import { useState } from 'react';
import {
  Box, Typography, Checkbox, Table, TableHead, TableRow, TableCell, TableBody,
  Stack, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Chip
} from '@mui/material';
import { SelectAll, Delete, Edit, Email } from '@mui/icons-material';
import AccessibleButton from '../common/AccessibleButton';
import { useToast } from '../common/Toast';
import { adminService } from '../../services/adminService';
import { emailService } from '../../services/emailService';

const BulkOperations = ({ applications, onRefresh }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDialog, setBulkDialog] = useState({ open: false, action: '', data: {} });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map(app => app._id));
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const openBulkDialog = (action) => {
    setBulkDialog({ open: true, action, data: {} });
  };

  const closeBulkDialog = () => {
    setBulkDialog({ open: false, action: '', data: {} });
  };

  const handleBulkStatusUpdate = async () => {
    setLoading(true);
    try {
      const promises = selectedIds.map(id => 
        adminService.updateApplicationStatus(id, bulkDialog.data.status, bulkDialog.data.comment)
      );
      await Promise.all(promises);
      success(`Updated ${selectedIds.length} applications`);
      setSelectedIds([]);
      onRefresh();
      closeBulkDialog();
    } catch (err) {
      error('Failed to update applications');
    }
    setLoading(false);
  };

  const handleBulkEmail = async () => {
    setLoading(true);
    try {
      const selectedApps = applications.filter(app => selectedIds.includes(app._id));
      const promises = selectedApps.map(app => 
        emailService.sendStatusChangeEmail(app._id, app.status, app.applicantId?.email)
      );
      await Promise.all(promises);
      success(`Sent emails to ${selectedIds.length} applicants`);
      setSelectedIds([]);
      closeBulkDialog();
    } catch (err) {
      error('Failed to send emails');
    }
    setLoading(false);
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      // Mock delete operation
      success(`Deleted ${selectedIds.length} applications (simulated)`);
      setSelectedIds([]);
      closeBulkDialog();
    } catch (err) {
      error('Failed to delete applications');
    }
    setLoading(false);
  };

  const executeBulkAction = () => {
    switch (bulkDialog.action) {
      case 'status':
        return handleBulkStatusUpdate();
      case 'email':
        return handleBulkEmail();
      case 'delete':
        return handleBulkDelete();
      default:
        return Promise.resolve();
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">
          Bulk Operations {selectedIds.length > 0 && `(${selectedIds.length} selected)`}
        </Typography>
        
        {selectedIds.length > 0 && (
          <Stack direction="row" spacing={1}>
            <AccessibleButton
              startIcon={<Edit />}
              onClick={() => openBulkDialog('status')}
              variant="outlined"
              size="small"
              ariaLabel="Bulk update status"
            >
              Update Status
            </AccessibleButton>
            <AccessibleButton
              startIcon={<Email />}
              onClick={() => openBulkDialog('email')}
              variant="outlined"
              size="small"
              ariaLabel="Send bulk emails"
            >
              Send Emails
            </AccessibleButton>
            <AccessibleButton
              startIcon={<Delete />}
              onClick={() => openBulkDialog('delete')}
              variant="outlined"
              color="error"
              size="small"
              ariaLabel="Bulk delete applications"
            >
              Delete
            </AccessibleButton>
          </Stack>
        )}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedIds.length === applications.length && applications.length > 0}
                indeterminate={selectedIds.length > 0 && selectedIds.length < applications.length}
                onChange={handleSelectAll}
                inputProps={{ 'aria-label': 'Select all applications' }}
              />
            </TableCell>
            <TableCell>Job Title</TableCell>
            <TableCell>Applicant</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Department</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app._id} hover>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.includes(app._id)}
                  onChange={() => handleSelectOne(app._id)}
                  inputProps={{ 'aria-label': `Select application for ${app.jobId?.title}` }}
                />
              </TableCell>
              <TableCell>{app.jobId?.title}</TableCell>
              <TableCell>{app.applicantId?.username}</TableCell>
              <TableCell>
                <Chip 
                  label={app.status} 
                  size="small" 
                  color={app.status === 'accepted' ? 'success' : 'default'}
                />
              </TableCell>
              <TableCell>{app.jobId?.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkDialog.open} onClose={closeBulkDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {bulkDialog.action === 'status' && 'Bulk Status Update'}
          {bulkDialog.action === 'email' && 'Send Bulk Emails'}
          {bulkDialog.action === 'delete' && 'Bulk Delete'}
        </DialogTitle>
        <DialogContent>
          {bulkDialog.action === 'status' && (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                select
                fullWidth
                label="New Status"
                value={bulkDialog.data.status || ''}
                onChange={(e) => setBulkDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, status: e.target.value }
                }))}
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
                value={bulkDialog.data.comment || ''}
                onChange={(e) => setBulkDialog(prev => ({
                  ...prev,
                  data: { ...prev.data, comment: e.target.value }
                }))}
              />
            </Stack>
          )}
          
          {bulkDialog.action === 'email' && (
            <Alert severity="info">
              Send status update emails to {selectedIds.length} selected applicants?
            </Alert>
          )}
          
          {bulkDialog.action === 'delete' && (
            <Alert severity="warning">
              Are you sure you want to delete {selectedIds.length} applications? This action cannot be undone.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <AccessibleButton onClick={closeBulkDialog} ariaLabel="Cancel bulk operation">
            Cancel
          </AccessibleButton>
          <AccessibleButton 
            onClick={executeBulkAction} 
            variant="contained" 
            loading={loading}
            color={bulkDialog.action === 'delete' ? 'error' : 'primary'}
            ariaLabel="Confirm bulk operation"
          >
            {bulkDialog.action === 'status' && 'Update All'}
            {bulkDialog.action === 'email' && 'Send Emails'}
            {bulkDialog.action === 'delete' && 'Delete All'}
          </AccessibleButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BulkOperations;