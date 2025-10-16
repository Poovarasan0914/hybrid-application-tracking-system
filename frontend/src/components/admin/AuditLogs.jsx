import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, TextField, MenuItem, Stack, Pagination } from '@mui/material';
import { formatDateTime } from '../../utils/helpers';
import { auditService } from '../../services/auditService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', resourceType: '', page: 1 });
  const [pagination, setPagination] = useState({ totalPages: 1, totalLogs: 0 });

  const loadLogs = async () => {
    setLoading(true);
    try {
      console.log('Loading audit logs with filters:', filters);
      const response = await auditService.getAuditLogs(filters);
      console.log('Audit logs response:', response);
      setLogs(response.auditLogs || []);
      setPagination({ 
        totalPages: response.totalPages || 1, 
        totalLogs: response.totalLogs || 0 
      });
    } catch (error) {
      console.error('Failed to load audit logs:', error);
      console.error('Error details:', error.response?.data || error.message);
      setLogs([]);
      setPagination({ totalPages: 1, totalLogs: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const getActionColor = (action) => {
    const colors = {
      'USER_LOGIN': 'success',
      'USER_LOGOUT': 'default',
      'USER_CREATE': 'primary',
      'APPLICATION_SUBMIT': 'info',
      'APPLICATION_STATUS_CHANGE': 'warning',
      'BOT_MIMIC_WORKFLOW': 'secondary',
      'JOB_CREATE': 'primary',
      'JOB_DELETE': 'error'
    };
    return colors[action] || 'default';
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>System Audit Logs</Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          select
          size="small"
          label="Action"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Actions</MenuItem>
          <MenuItem value="USER_LOGIN">User Login</MenuItem>
          <MenuItem value="USER_CREATE">User Create</MenuItem>
          <MenuItem value="APPLICATION_SUBMIT">Application Submit</MenuItem>
          <MenuItem value="APPLICATION_STATUS_CHANGE">Status Change</MenuItem>
          <MenuItem value="BOT_MIMIC_WORKFLOW">Bot Mimic</MenuItem>
          <MenuItem value="JOB_CREATE">Job Create</MenuItem>
        </TextField>
        
        <TextField
          select
          size="small"
          label="Resource Type"
          value={filters.resourceType}
          onChange={(e) => setFilters({ ...filters, resourceType: e.target.value, page: 1 })}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="job">Job</MenuItem>
          <MenuItem value="application">Application</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </TextField>
      </Stack>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? 'Loading audit logs...' : 'No audit logs found'}
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} hover>
                  <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                  <TableCell>{log.userId?.username || 'System'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action.replace(/_/g, ' ')} 
                      color={getActionColor(log.action)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={log.resourceType} 
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pagination.totalPages}
            page={filters.page}
            onChange={(e, page) => setFilters({ ...filters, page })}
          />
        </Box>
      )}
    </Box>
  );
};

export default AuditLogs;