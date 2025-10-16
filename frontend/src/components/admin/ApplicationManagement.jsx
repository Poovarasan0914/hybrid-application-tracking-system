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
    fontSize: '15px',
    color: 'var(--text)'
  };

  const buttonStyle = {
    ...commonStyles,
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: 'var(--primary-600)',
    borderColor: 'var(--primary-600)',
    color: 'white'
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'var(--primary-600)',
    border: '1px solid var(--primary-600)'
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
    <div className="container" style={{ padding: '20px', ...commonStyles }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)', margin: 0, fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>Application Management</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ ...commonStyles, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '180px', background: 'var(--surface)' }}
          >
            <option value="all">All Roles</option>
            <option value="technical">Technical Only</option>
            <option value="non-technical">Non-Technical Only</option>
          </select>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            style={{ ...commonStyles, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '180px', background: 'var(--surface)' }}
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
        <div style={{ padding: '12px', backgroundColor: 'var(--danger-100)', border: '1px solid #f44336', borderRadius: '8px', color: 'var(--danger-600)', marginBottom: '16px', ...commonStyles }}>
          {error}
        </div>
      )}
      
      <div style={{ padding: '12px', backgroundColor: 'var(--primary-100)', border: '1px solid var(--primary-200)', borderRadius: '8px', color: 'var(--primary-700)', marginBottom: '16px', ...commonStyles }}>
        <strong>Admin Role:</strong> Full management for non-technical roles. For technical roles, you can only accept/reject applications that have been shortlisted by the bot.
      </div>

      <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-2)' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>Job & Role Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Applicant</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Profile</th>
              <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Notes</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(a => (
              <tr key={a._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '6px' }}>{a.jobId?.title}</div>
                    <span style={{ 
                      padding: '4px 10px', 
                      backgroundColor: a.jobId?.roleCategory === 'technical' ? 'var(--primary-100)' : '#fce4ec', 
                      color: a.jobId?.roleCategory === 'technical' ? 'var(--primary-700)' : '#c2185b',
                      border: a.jobId?.roleCategory === 'technical' ? '1px solid var(--primary-200)' : '1px solid #f8bbd0',
                      borderRadius: '9999px',
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
                    style={{ ...secondaryButton, padding: '6px 10px' }}
                  >
                    👤 {expandedRows.has(a._id) ? '▲' : '▼'}
                  </button>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {a.jobId?.roleCategory === 'non-technical' ? (
                    <button
                      onClick={() => setNoteDialog({ open: true, appId: a._id, note: '' })}
                      style={{ ...secondaryButton, padding: '6px 10px' }}
                    >
                      💬 Add Note
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Bot Managed</span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {a.jobId?.roleCategory === 'non-technical' ? (
                    <button
                      onClick={() => setStatusDialog({ open: true, appId: a._id, status: a.status, comment: '' })}
                      style={{ ...primaryButton, padding: '8px 12px' }}
                    >
                      ✏️ Update Status
                    </button>
                  ) : a.status === 'shortlisted' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'accepted', comment: '' })}
                        style={{ ...primaryButton, backgroundColor: 'var(--success-600)', borderColor: 'var(--success-600)', padding: '8px 12px' }}
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => setStatusDialog({ open: true, appId: a._id, status: 'rejected', comment: '' })}
                        style={{ ...primaryButton, backgroundColor: 'var(--danger-600)', borderColor: 'var(--danger-600)', padding: '8px 12px' }}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>
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
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Add Note to Application</h3>
            <textarea
              value={noteDialog.note}
              onChange={(e) => setNoteDialog({ ...noteDialog, note: e.target.value })}
              placeholder="Add a note that will be visible to the applicant..."
              style={{ width: '100%', height: '120px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', resize: 'vertical', background: 'var(--surface)' }}
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
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Update Application Status</h3>
            <div style={{ marginBottom: '16px' }}>
              <select
                value={statusDialog.status}
                onChange={(e) => setStatusDialog({ ...statusDialog, status: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--surface)' }}
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
              style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', resize: 'vertical', background: 'var(--surface)' }}
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