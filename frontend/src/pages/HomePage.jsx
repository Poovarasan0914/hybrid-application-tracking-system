import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    }}>
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 0'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Application Tracking System
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          maxWidth: '600px',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>
          Streamline your job application process with our comprehensive ATS platform
        </p>
        
        {isAuthenticated ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Welcome back, {user?.username}!
            </h2>
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'bot' ? '/bot' : '/dashboard')}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: '#2563eb',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 6px rgba(37, 99, 235, 0.1)',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 8px rgba(37, 99, 235, 0.2)'
                  }
                }}
              >
                Go to {user?.role === 'admin' ? 'Admin' : user?.role === 'bot' ? 'Bot' : 'Dashboard'}
              </button>
              <button 
                onClick={() => navigate('/jobs')}
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2563eb',
                  backgroundColor: 'transparent',
                  border: '2px solid #2563eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.1)'
                  }
                }}
              >
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button 
              onClick={() => navigate('/login')}
              style={{
                padding: '0.75rem 2.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#2563eb',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 6px rgba(37, 99, 235, 0.1)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 8px rgba(37, 99, 235, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.1)';
              }}
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{
                padding: '0.75rem 2.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2563eb',
                backgroundColor: 'transparent',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
