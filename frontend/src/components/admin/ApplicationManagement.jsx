import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import ApplicationStatus from '../applications/ApplicationStatus';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteDialog, setNoteDialog] = useState({ open: false, appId: null, note: '' });
  const [statusDialog, setStatusDialog] = useState({ open: false, appId: null, status: '', comment: '' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { success, error: showError } = useToast();

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

  const toggleRowExpansion = (appId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedRows(newExpanded);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getNonTechnicalApplications({ 
        status: filter || undefined,
        roleCategory: roleFilter,
        page: 1, 
        limit: 50 
      });
      setApplications(data.applications || []);
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load applications';
      setError(errorMsg);
      showError(errorMsg);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter, roleFilter]);

  const handleUpdateStatus = async () => {
    try {
      await adminService.updateApplicationStatus(
        statusDialog.appId, 
        statusDialog.status, 
        statusDialog.comment
      );
      setStatusDialog({ open: false, appId: null, status: '', comment: '' });
      success('Application status updated successfully');
      await load();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  const handleAddNote = async () => {
    try {
      await adminService.addApplicationNote(noteDialog.appId, noteDialog.note);
      setNoteDialog({ open: false, appId: null, note: '' });
      success('Note added successfully');
      await load();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add note';
      setError(errorMsg);
      showError(errorMsg);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ padding: '20px', ...commonStyles }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Application Management</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ ...commonStyles, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '150px' }}
          >
            <option value="all">All Roles</option>
            <option value="technical">Technical Only</option>
            <option value="non-technical">Non-Technical Only</option>
          </select>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{ ...commonStyles, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '150px' }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', color: '#c62828', marginBottom: '16px', ...commonStyles }}>
          {error}
        </div>
      )}
      
      <div style={{ padding: '12px', backgroundColor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px', color: '#1565c0', marginBottom: '16px', ...commonStyles }}>
        <strong>Admin Role:</strong> Full management for non-technical roles. For technical roles, you can only accept/reject applications that have been shortlisted by the bot.
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', ...commonStyles }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Job & Role Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Applicant</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Profile</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Notes</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(a => (
              <tr key={a._id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>{a.jobId?.title}</div>
                    <span style={{ 
                      padding: '2px 8px', 
                      backgroundColor: a.jobId?.roleCategory === 'technical' ? '#e3f2fd' : '#fce4ec', 
                      color: a.jobId?.roleCategory === 'technical' ? '#1976d2' : '#c2185b',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {a.jobId?.roleCategory || 'unknown'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>{a.applicantId?.username} ({a.applicantId?.email})</td>
                <td style={{ padding: '12px' }}><ApplicationStatus status={a.status} /></td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleRowExpansion(a._id)}
                    style={{ ...secondaryButton, padding: '4px 8px' }}
                  >
                    👤 {expandedRows.has(a._id) ? '▲' : '▼'}
                  </button>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {a.jobId?.roleCategory === 'non-technical' ? (
                    <button
                      onClick={() => setNoteDialog({ open: true, appId: a._id, note: '' })}
                      style={{ ...secondaryButton, padding: '4px 8px' }}
                    >
                      💬 Add Note
                    </button>
                  ) : (
                    <span style={{ color: '#666' }}>Bot Managed</span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {a.jobId?.roleCategory === 'non-technical' ? (
                    <button
                      onClick={() => setStatusDialog({ open: true, appId: a._id, status: a.status, comment: '' })}
                      style={{ ...primaryButton, padding: '6px 12px' }}
                    >
                      ✏️ Update Status
                    </button>
                  ) : a.status === 'shortlisted' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'accepted', comment: '' })}
                        style={{ ...primaryButton, backgroundColor: '#2e7d32', padding: '6px 12px' }}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'rejected', comment: '' })}
                        style={{ ...primaryButton, backgroundColor: '#d32f2f', padding: '6px 12px' }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#666' }}>
                      {a.status === 'accepted' ? 'Accepted' : a.status === 'rejected' ? 'Rejected' : 'Bot Processing'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Dialog */}
      {noteDialog.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px', ...commonStyles }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Add Note to Application</h3>
            <textarea
              value={noteDialog.note}
              onChange={(e) => setNoteDialog({ ...noteDialog, note: e.target.value })}
              placeholder="Add a note that will be visible to the applicant..."
              style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', ...commonStyles }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setNoteDialog({ open: false, appId: null, note: '' })} style={secondaryButton}>Cancel</button>
              <button onClick={handleAddNote} disabled={!noteDialog.note.trim()} style={{ ...primaryButton, opacity: !noteDialog.note.trim() ? 0.5 : 1 }}>Add Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Dialog */}
      {statusDialog.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px', ...commonStyles }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Update Application Status</h3>
            <div style={{ marginBottom: '16px' }}>
              <select
                value={statusDialog.status}
                onChange={(e) => setStatusDialog({ ...statusDialog, status: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', ...commonStyles }}
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>
            <textarea
              value={statusDialog.comment}
              onChange={(e) => setStatusDialog({ ...statusDialog, comment: e.target.value })}
              placeholder="Add a comment about this status change..."
              style={{ width: '100%', height: '80px', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical', ...commonStyles }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setStatusDialog({ open: false, appId: null, status: '', comment: '' })} style={secondaryButton}>Cancel</button>
              <button onClick={handleUpdateStatus} disabled={!statusDialog.status} style={{ ...primaryButton, opacity: !statusDialog.status ? 0.5 : 1 }}>Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;