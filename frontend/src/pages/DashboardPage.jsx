import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ApplicationList from '../components/applications/ApplicationList';
import UserProfile from '../components/profile/UserProfile';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

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
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Welcome back, {user?.username}! 👋
        </p>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '2rem'
            }}>
              <button
                onClick={() => setTab(0)}
                style={{
                  padding: '1rem 2rem',
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
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
                onMouseOut={(e) => {
                  if (tab !== 0) {
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                My Applications
              </button>
              <button
                onClick={() => setTab(1)}
                style={{
                  padding: '1rem 2rem',
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
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
                onMouseOut={(e) => {
                  if (tab !== 1) {
                    e.currentTarget.style.color = '#6b7280';
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
