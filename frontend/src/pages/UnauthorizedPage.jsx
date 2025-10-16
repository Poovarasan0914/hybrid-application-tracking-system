import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '4rem 20px',
      textAlign: 'center'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '6rem',
          color: '#dc2626',
          margin: '0',
          fontWeight: '700',
          lineHeight: '1'
        }}>
          403
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#1f2937',
          marginBottom: '1.5rem',
          fontWeight: '500'
        }}>
          Unauthorized Access
        </p>
        <p style={{
          color: '#6b7280',
          fontSize: '1.125rem',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Sorry, you don't have permission to access this page.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.1)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 8px rgba(37, 99, 235, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.1)';
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
