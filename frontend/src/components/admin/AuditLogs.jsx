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
      'USER_LOGIN': { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' },
      'USER_LOGOUT': { bg: '#eee', color: '#333', border: '#ddd' },
      'USER_CREATE': { bg: '#e7f1ff', color: '#113a76', border: '#cfe2ff' },
      'APPLICATION_SUBMIT': { bg: '#cff4fc', color: '#055160', border: '#b6effb' },
      'APPLICATION_STATUS_CHANGE': { bg: '#fff3cd', color: '#664d03', border: '#ffecb5' },
      'BOT_MIMIC_WORKFLOW': { bg: '#e7f1ff', color: '#113a76', border: '#cfe2ff' },
      'JOB_CREATE': { bg: '#e7f1ff', color: '#113a76', border: '#cfe2ff' },
      'JOB_DELETE': { bg: '#f8d7da', color: '#842029', border: '#f5c2c7' }
    };
    return map[action] || { bg: '#eee', color: '#333', border: '#ddd' };
  };

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>System Audit Logs</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="filterAction" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Action</label>
          <select
            id="filterAction"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
            style={{ minWidth: 200, padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc' }}
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
          <label htmlFor="filterType" style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Resource Type</label>
          <select
            id="filterType"
            value={filters.resourceType}
            onChange={(e) => setFilters({ ...filters, resourceType: e.target.value, page: 1 })}
            style={{ minWidth: 150, padding: '6px 8px', borderRadius: 6, border: '1px solid #ccc' }}
          >
            <option value="">All Types</option>
            <option value="user">User</option>
            <option value="job">Job</option>
            <option value="application">Application</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f7f7f7', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Timestamp</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>User</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Action</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Resource</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Description</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>IP Address</th>
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
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{formatDateTime(log.timestamp)}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{log.userId?.username || 'System'}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}`, padding: '2px 6px', borderRadius: 9999, fontSize: 12 }}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>
                      <span style={{ background: '#fff', color: '#333', border: '1px solid #ddd', padding: '2px 6px', borderRadius: 9999, fontSize: 12 }}>
                        {log.resourceType}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{log.description}</td>
                    <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{log.ipAddress || 'N/A'}</td>
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
                    border: '1px solid #ccc',
                    background: active ? '#1976d2' : '#fff',
                    color: active ? '#fff' : '#222',
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