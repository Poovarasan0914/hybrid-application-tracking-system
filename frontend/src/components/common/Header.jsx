import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import NavLink from './NavLink';
import { KeyboardIcon } from './Icons';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <RouterLink 
          to="/" 
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{
            background: 'linear-gradient(45deg, var(--primary-600), #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800'
          }}>
            ATS
          </span>
        </RouterLink>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          {!isAuthenticated ? (
            <>
              <NavLink to="/jobs">Jobs</NavLink>
              <NavLink to="/login" style={{ padding: '10px 16px' }}>Login</NavLink>
              <NavLink 
                to="/register" 
                style={{
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease'
                }}
                hoverStyle={{
                  backgroundColor: 'var(--primary-700)'
                }}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/jobs">Jobs</NavLink>
              {user?.role === 'applicant' && <NavLink to="/dashboard">Dashboard</NavLink>}
              {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              {user?.role === 'bot' && <NavLink to="/bot">Bot</NavLink>}
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'var(--primary-600)',
                  border: '1px solid var(--primary-600)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-700)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--primary-600)';
                }}
              >
                Logout
              </button>
            </>
          )}
        
          

        </div>
      </nav>
      {showShortcuts && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '1rem',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: 'var(--shadow-md)',
          marginTop: '0.5rem',
          zIndex: 1000,
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            <p style={{ margin: '0.25rem 0' }}>Ctrl+H - Home</p>
            <p style={{ margin: '0.25rem 0' }}>Ctrl+D - Dashboard</p>
            <p style={{ margin: '0.25rem 0' }}>Ctrl+J - Jobs</p>
            <p style={{ margin: '0.25rem 0' }}>Ctrl+L - Logout</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;