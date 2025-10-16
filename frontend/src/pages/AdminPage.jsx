import { useState } from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import JobCreation from '../components/admin/JobCreation';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import AuditLogs from '../components/admin/AuditLogs';

const AdminPage = () => {
  const [tab, setTab] = useState(0);

  const tabs = [
    { id: 0, label: 'Dashboard', icon: '📊' },
    { id: 1, label: 'Applications', icon: '📝' },
    { id: 2, label: 'Create Jobs', icon: '✨' },
    { id: 3, label: 'Users', icon: '👥' },
    { id: 4, label: 'Audit Logs', icon: '📋' }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 20px'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#1f2937',
          marginBottom: '2rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚡</span> Admin Dashboard
        </h1>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            overflowX: 'auto',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '1rem',
              minWidth: 'max-content'
            }}>
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: tab === item.id ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: tab === item.id ? '#2563eb' : '#6b7280',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => {
                    if (tab !== item.id) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (tab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ minHeight: '400px' }}>
            {tab === 0 && <AdminDashboard />}
            {tab === 1 && <ApplicationManagement />}
            {tab === 2 && <JobCreation />}
            {tab === 3 && <UserManagement />}
            {tab === 4 && <AuditLogs />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
