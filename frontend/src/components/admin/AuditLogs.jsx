import { useEffect, useState } from 'react';
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

  const getActionStyle = (action) => {
    const map = {
      'USER_LOGIN': { bg: 'var(--success-100)', color: 'var(--success-600)', border: '#bbf7d0' },
      'USER_LOGOUT': { bg: 'var(--surface-2)', color: 'var(--text)', border: 'var(--border)' },
      'USER_CREATE': { bg: 'var(--primary-100)', color: 'var(--primary-700)', border: 'var(--primary-200)' },
      'APPLICATION_SUBMIT': { bg: '#cff4fc', color: '#055160', border: '#b6effb' },
      'APPLICATION_STATUS_CHANGE': { bg: 'var(--warning-100)', color: 'var(--warning-600)', border: '#fde68a' },
      'BOT_MIMIC_WORKFLOW': { bg: 'var(--primary-100)', color: 'var(--primary-700)', border: 'var(--primary-200)' },
      'JOB_CREATE': { bg: 'var(--primary-100)', color: 'var(--primary-700)', border: 'var(--primary-200)' },
      'JOB_DELETE': { bg: 'var(--danger-100)', color: 'var(--danger-600)', border: '#fecaca' }
    };
    return map[action] || { bg: '#eee', color: '#333', border: '#ddd' };
  };

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>System Audit Logs</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="filterAction" style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>Action</label>
          <select
            id="filterAction"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
            style={{ minWidth: 200, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
          >
            <option value="">All Actions</option>
            <option value="USER_LOGIN">User Login</option>
            <option value="USER_CREATE">User Create</option>
            <option value="APPLICATION_SUBMIT">Application Submit</option>
            <option value="APPLICATION_STATUS_CHANGE">Status Change</option>
            <option value="BOT_MIMIC_WORKFLOW">Bot Mimic</option>
            <option value="JOB_CREATE">Job Create</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterType" style={{ display: 'block', marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>Resource Type</label>
          <select
            id="filterType"
            value={filters.resourceType}
            onChange={(e) => setFilters({ ...filters, resourceType: e.target.value, page: 1 })}
            style={{ minWidth: 150, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
          >
            <option value="">All Types</option>
            <option value="user">User</option>
            <option value="job">Job</option>
            <option value="application">Application</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Timestamp</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>User</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Action</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Resource</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Description</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 12 }}>
                  {loading ? 'Loading audit logs...' : 'No audit logs found'}
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const style = getActionStyle(log.action);
                return (
                  <tr key={log._id}>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{formatDateTime(log.timestamp)}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{log.userId?.username || 'System'}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, padding: '2px 6px', borderRadius: 9999, fontSize: 12 }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 9999, fontSize: 12 }}>
                        {log.resourceType}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{log.description}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{log.ipAddress || 'N/A'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <div style={{ display: 'inline-flex', gap: 6 }}>
            {Array.from({ length: pagination.totalPages }).map((_, i) => {
              const page = i + 1;
              const active = page === filters.page;
              return (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: active ? 'var(--primary-600)' : 'var(--surface)',
                    color: active ? '#fff' : 'var(--text)',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;