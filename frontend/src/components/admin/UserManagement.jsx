import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Typography, Box } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (userId, isActive) => {
    await adminService.toggleUserActivation(userId, isActive);
    await load();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id} hover>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={!!u.isActive}
                    onChange={(e) => handleToggle(u._id, e.target.checked)}
                    inputProps={{ 'aria-label': 'activate user' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;


