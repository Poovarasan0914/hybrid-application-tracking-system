import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, MenuItem, TextField, Button } from '@mui/material';
import ApplicationStatus from '../applications/ApplicationStatus';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');

  const load = async () => {
    const data = await applicationService.getAllApplications({ status: filter || undefined, page: 1, limit: 50 });
    setApplications(data.applications || []);
  };

  useEffect(() => { load(); }, [filter]);

  const handleUpdateStatus = async (id, status) => {
    await applicationService.updateApplicationStatus(id, status);
    await load();
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2 }} spacing={2}>
        <Typography variant="h6">Applications</Typography>
        <TextField select size="small" label="Filter by status" value={filter} onChange={e => setFilter(e.target.value)} sx={{ minWidth: 220 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="reviewing">Reviewing</MenuItem>
          <MenuItem value="shortlisted">Shortlisted</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="accepted">Accepted</MenuItem>
        </TextField>
      </Stack>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(a => (
              <TableRow key={a._id} hover>
                <TableCell>{a.jobId?.title}</TableCell>
                <TableCell>{a.applicantId?.username} ({a.applicantId?.email})</TableCell>
                <TableCell><ApplicationStatus status={a.status} /></TableCell>
                <TableCell align="right">
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => handleUpdateStatus(a._id, 'reviewing')}>Reviewing</Button>
                    <Button size="small" onClick={() => handleUpdateStatus(a._id, 'shortlisted')}>Shortlist</Button>
                    <Button size="small" color="error" onClick={() => handleUpdateStatus(a._id, 'rejected')}>Reject</Button>
                    <Button size="small" color="success" onClick={() => handleUpdateStatus(a._id, 'accepted')}>Accept</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ApplicationManagement;


