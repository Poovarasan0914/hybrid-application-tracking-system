import { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { JOB_TYPES } from '../../utils/constants';

const emptyJob = {
  title: '',
  department: '',
  description: '',
  requirements: [],
  type: 'full-time',
  location: '',
  salary: { min: 0, max: 0, currency: 'USD' },
  deadline: ''
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyJob);

  const load = async () => {
    const data = await jobService.getActiveJobs({ page: 1, limit: 50 });
    setJobs(data.jobs || []);
  };

  useEffect(() => { load(); }, []);

  const handleOpen = (job = null) => {
    setEditing(job);
    setForm(job ? { ...job } : emptyJob);
    setOpen(true);
  };

  const handleClose = () => { setOpen(false); };

  const handleSave = async () => {
    const payload = { ...form, requirements: (form.requirements || []).filter(Boolean) };
    if (editing) {
      await jobService.updateJob(editing._id, payload);
    } else {
      await jobService.createJob(payload);
    }
    setOpen(false);
    await load();
  };

  const handleDelete = async (id) => {
    await jobService.deleteJob(id);
    await load();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Jobs</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>New Job</Button>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(j => (
              <TableRow key={j._id} hover>
                <TableCell>{j.title}</TableCell>
                <TableCell>{j.department}</TableCell>
                <TableCell>{j.type}</TableCell>
                <TableCell>{j.location}</TableCell>
                <TableCell>{(j.deadline || '').toString().slice(0, 10)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(j)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(j._id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Job' : 'New Job'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth />
            <TextField label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline minRows={4} />
            <TextField label="Requirements (comma separated)" value={(form.requirements || []).join(', ')} onChange={e => setForm({ ...form, requirements: e.target.value.split(',').map(s => s.trim()) })} fullWidth />
            <TextField select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} fullWidth>
              <MenuItem value={JOB_TYPES.FULL_TIME}>Full-time</MenuItem>
              <MenuItem value={JOB_TYPES.PART_TIME}>Part-time</MenuItem>
              <MenuItem value={JOB_TYPES.CONTRACT}>Contract</MenuItem>
              <MenuItem value={JOB_TYPES.INTERNSHIP}>Internship</MenuItem>
            </TextField>
            <TextField label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField type="number" label="Salary Min" value={form.salary?.min || 0} onChange={e => setForm({ ...form, salary: { ...form.salary, min: Number(e.target.value) } })} fullWidth />
              <TextField type="number" label="Salary Max" value={form.salary?.max || 0} onChange={e => setForm({ ...form, salary: { ...form.salary, max: Number(e.target.value) } })} fullWidth />
              <TextField label="Currency" value={form.salary?.currency || 'USD'} onChange={e => setForm({ ...form, salary: { ...form.salary, currency: e.target.value } })} fullWidth />
            </Stack>
            <TextField type="date" label="Deadline" InputLabelProps={{ shrink: true }} value={(form.deadline || '').toString().slice(0, 10)} onChange={e => setForm({ ...form, deadline: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobManagement;


