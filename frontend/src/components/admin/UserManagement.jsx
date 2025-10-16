import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../common/Toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState({ open: false, username: '', email: '', password: '', role: 'applicant' });
  const { success, error } = useToast();

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
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      error('Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggleActivation = async (userId, isActive) => {
    try {
      await adminService.toggleUserActivation(userId, !isActive);
      success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      await load();
    } catch (err) {
      error('Failed to update user status');
    }
  };

  const handleCreateUser = async () => {
    try {
      if (createDialog.role === 'bot') {
        await adminService.createBotUser({
          username: createDialog.username,
          email: createDialog.email,
          password: createDialog.password
        });
      } else {
        // Regular user creation would go here
        success('User creation not implemented for non-bot users');
        return;
      }
      success('User created successfully');
      setCreateDialog({ open: false, username: '', email: '', password: '', role: 'applicant' });
      await load();
    } catch (err) {
      error('Failed to create user');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', ...commonStyles }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading users...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', ...commonStyles }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0 }}>User Management</h2>
        <button onClick={() => setCreateDialog({ ...createDialog, open: true })} style={primaryButton}>Create User</button>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...commonStyles }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Username</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px' }}>{user.username}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: user.role === 'admin' ? '#1976d2' : user.role === 'bot' ? '#9c27b0' : '#4caf50', 
                    color: 'white', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: user.isActive ? '#4caf50' : '#f44336', 
                    color: 'white', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleActivation(user._id, user.isActive)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: user.isActive ? '#f44336' : '#4caf50',
                      color: 'white',
                      padding: '6px 12px'
                    }}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No users found
        </div>
      )}

      {createDialog.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Create New User</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Username</label>
              <input 
                type="text" 
                value={createDialog.username} 
                onChange={e => setCreateDialog({ ...createDialog, username: e.target.value })} 
                style={inputStyle} 
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                value={createDialog.email} 
                onChange={e => setCreateDialog({ ...createDialog, email: e.target.value })} 
                style={inputStyle} 
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
              <input 
                type="password" 
                value={createDialog.password} 
                onChange={e => setCreateDialog({ ...createDialog, password: e.target.value })} 
                style={inputStyle} 
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Role</label>
              <select 
                value={createDialog.role} 
                onChange={e => setCreateDialog({ ...createDialog, role: e.target.value })} 
                style={inputStyle}
              >
                <option value="applicant">Applicant</option>
                <option value="admin">Admin</option>
                <option value="bot">Bot</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setCreateDialog({ open: false, username: '', email: '', password: '', role: 'applicant' })} 
                style={secondaryButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateUser} 
                disabled={!createDialog.username || !createDialog.email || !createDialog.password}
                style={{ 
                  ...primaryButton, 
                  opacity: (!createDialog.username || !createDialog.email || !createDialog.password) ? 0.5 : 1 
                }}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;