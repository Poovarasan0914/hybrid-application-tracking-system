// Loading spinner component without MUI
const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  variant = 'circular', 
  fullScreen = false,
  color = 'var(--primary-600)'
}) => {
  const containerStyle = fullScreen 
    ? { minHeight: '100vh', paddingTop: 0, paddingBottom: 0 } 
    : { paddingTop: '16px', paddingBottom: '16px' };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      ...containerStyle
    }}>
      {variant === 'circular' ? (
        <div style={{
          width: size,
          height: size,
          border: `${Math.max(2, Math.floor(size/10))}px solid rgba(0,0,0,0.08)`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      ) : (
        <div style={{
          width: '100%',
          maxWidth: 200,
          height: 4,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.10))',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2
        }}>
          <div style={{
            position: 'absolute',
            left: '-40%',
            top: 0,
            height: '100%',
            width: '40%',
            backgroundColor: color,
            animation: 'indeterminate 1.4s infinite'
          }} />
        </div>
      )}
      {message && (
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{message}</span>
      )}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes indeterminate {
          0% { left: -40%; width: 40%; }
          50% { left: 20%; width: 60%; }
          100% { left: 100%; width: 80%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
