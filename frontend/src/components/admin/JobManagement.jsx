import { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';
import { JOB_TYPES } from '../../utils/constants';

const emptyJob = {
  title: '',
  department: '',
  description: '',
  requirements: [],
  roleCategory: 'technical',
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

  const commonStyles = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px'
  };

  const buttonStyle = {
    ...commonStyles,
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: 'white'
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#1976d2',
    border: '1px solid #1976d2'
  };

  const inputStyle = {
    ...commonStyles,
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '16px'
  };

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
    <div style={{ padding: '20px', ...commonStyles }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>Jobs</h2>
        <button onClick={() => handleOpen()} style={primaryButton}>New Job</button>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...commonStyles }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Employment</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Role Category</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Location</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Deadline</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px' }}>{j.title}</td>
                <td style={{ padding: '12px' }}>{j.department}</td>
                <td style={{ padding: '12px' }}>{j.type}</td>
                <td style={{ padding: '12px' }}>{j.roleCategory}</td>
                <td style={{ padding: '12px' }}>{j.location}</td>
                <td style={{ padding: '12px' }}>{(j.deadline || '').toString().slice(0, 10)}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button onClick={() => handleOpen(j)} style={{ ...secondaryButton, marginRight: '8px', padding: '4px 8px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(j._id)} style={{ ...primaryButton, backgroundColor: '#d32f2f', padding: '4px 8px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>{editing ? 'Edit Job' : 'New Job'}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Department</label>
              <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Requirements (comma separated)</label>
              <input type="text" value={(form.requirements || []).join(', ')} onChange={e => setForm({ ...form, requirements: e.target.value.split(',').map(s => s.trim()) })} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Role Category</label>
                <select value={form.roleCategory} onChange={e => setForm({ ...form, roleCategory: e.target.value })} style={inputStyle}>
                  <option value="technical">Technical</option>
                  <option value="non-technical">Non-technical</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value={JOB_TYPES.FULL_TIME}>Full-time</option>
                  <option value={JOB_TYPES.PART_TIME}>Part-time</option>
                  <option value={JOB_TYPES.CONTRACT}>Contract</option>
                  <option value={JOB_TYPES.INTERNSHIP}>Internship</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Location</label>
              <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Salary Min</label>
                <input type="number" value={form.salary?.min || 0} onChange={e => setForm({ ...form, salary: { ...form.salary, min: Number(e.target.value) } })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Salary Max</label>
                <input type="number" value={form.salary?.max || 0} onChange={e => setForm({ ...form, salary: { ...form.salary, max: Number(e.target.value) } })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Currency</label>
                <input type="text" value={form.salary?.currency || 'USD'} onChange={e => setForm({ ...form, salary: { ...form.salary, currency: e.target.value } })} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Deadline</label>
              <input type="date" value={(form.deadline || '').toString().slice(0, 10)} onChange={e => setForm({ ...form, deadline: e.target.value })} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={handleClose} style={secondaryButton}>Cancel</button>
              <button onClick={handleSave} style={primaryButton}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;