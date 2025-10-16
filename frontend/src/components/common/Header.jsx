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
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <RouterLink 
          to="/" 
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1f2937',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
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
          gap: '1.5rem'
        }}>
          {!isAuthenticated ? (
            <>
              <NavLink to="/jobs">Jobs</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink 
                to="/register" 
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.3s ease'
                }}
                hoverStyle={{
                  backgroundColor: '#1d4ed8'
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
                  background: 'none',
                  border: 'none',
                  color: '#1f2937',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
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
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '0.5rem',
          zIndex: 1000,
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#4b5563',
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