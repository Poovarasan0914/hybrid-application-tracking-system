import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, TextField, MenuItem } from '@mui/material';
import { formatDateTime } from '../../utils/helpers';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState('');
  const [resourceType, setResourceType] = useState('');

  const load = async () => {
    const params = {};
    if (action) params.action = action;
    if (resourceType) params.resourceType = resourceType;
    const data = await adminService.getAuditLogs(params);
    setLogs(data.auditLogs || data.logs || []);
  };

  useEffect(() => { load(); }, [action, resourceType]);

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Audit Logs</Typography>
        <TextField select size="small" label="Action" value={action} onChange={e => setAction(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="USER_CREATE">USER_CREATE</MenuItem>
          <MenuItem value="USER_UPDATE">USER_UPDATE</MenuItem>
          <MenuItem value="USER_LOGIN">USER_LOGIN</MenuItem>
          <MenuItem value="USER_STATUS_CHANGE">USER_STATUS_CHANGE</MenuItem>
          <MenuItem value="JOB_CREATE">JOB_CREATE</MenuItem>
          <MenuItem value="JOB_UPDATE">JOB_UPDATE</MenuItem>
          <MenuItem value="JOB_DELETE">JOB_DELETE</MenuItem>
          <MenuItem value="APPLICATION_SUBMIT">APPLICATION_SUBMIT</MenuItem>
          <MenuItem value="APPLICATION_STATUS_CHANGE">APPLICATION_STATUS_CHANGE</MenuItem>
          <MenuItem value="APPLICATION_NOTE_ADD">APPLICATION_NOTE_ADD</MenuItem>
          <MenuItem value="ADMIN_ACTION">ADMIN_ACTION</MenuItem>
        </TextField>
        <TextField select size="small" label="Resource" value={resourceType} onChange={e => setResourceType(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="user">user</MenuItem>
          <MenuItem value="job">job</MenuItem>
          <MenuItem value="application">application</MenuItem>
        </TextField>
      </Stack>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(log => (
              <TableRow key={log._id} hover>
                <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                <TableCell>{log.userId?.username} ({log.userId?.email})</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.resourceType}</TableCell>
                <TableCell>{log.description || log.details?.details || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AuditLogs;


