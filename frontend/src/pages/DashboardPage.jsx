import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ApplicationList from '../components/applications/ApplicationList';
import UserProfile from '../components/profile/UserProfile';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  return (
    <div className="container" style={{ maxWidth: '1200px', paddingTop: '24px', paddingBottom: '24px' }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          color: 'var(--text)',
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}>
          Welcome back, {user?.username}! 👋
        </p>

        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTab(0)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: tab === 0 ? '2px solid #2563eb' : '2px solid transparent',
                  color: tab === 0 ? '#2563eb' : '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (tab !== 0) {
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseOut={(e) => {
                  if (tab !== 0) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                My Applications
              </button>
              <button
                onClick={() => setTab(1)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: tab === 1 ? '2px solid #2563eb' : '2px solid transparent',
                  color: tab === 1 ? '#2563eb' : '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (tab !== 1) {
                    e.currentTarget.style.color = 'var(--text)';
                  }
                }}
                onMouseOut={(e) => {
                  if (tab !== 1) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                Profile
              </button>
            </div>
          </div>

          {tab === 0 && <ApplicationList />}
          {tab === 1 && <UserProfile />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
