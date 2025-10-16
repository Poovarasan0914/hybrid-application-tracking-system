import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ApplicationStatus from './ApplicationStatus';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await applicationService.getMyApplications();
    setApplications(data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>My Applications</Typography>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map(a => (
              <TableRow key={a._id} hover>
                <TableCell>{a.jobId?.title}</TableCell>
                <TableCell>{a.jobId?.department}</TableCell>
                <TableCell><ApplicationStatus status={a.status} /></TableCell>
                <TableCell>{new Date(a.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/applications/${a._id}/timeline`)}
                    title="View Timeline"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ApplicationList;