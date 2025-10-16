import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

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

  const handleCreateBot = async () => {
    await adminService.createBotUser(form);
    setOpen(false);
    setForm({ username: '', email: '', password: '' });
    await load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create Bot User</Button>
      </Box>
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

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Bot User</DialogTitle>
        <DialogContent>
          <TextField label="Username" fullWidth margin="normal" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateBot}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;


