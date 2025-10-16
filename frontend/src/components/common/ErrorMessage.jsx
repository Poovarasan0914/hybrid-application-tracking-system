import { useState } from 'react';

// Error message component with retry functionality
const ErrorMessage = ({ 
  error, 
  title = 'Error', 
  onRetry, 
  showRetry = true,
  severity = 'error',
  variant = 'standard'
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!error) return null;

  const colorMap = {
    error: { bg: '#f8d7da', color: '#842029', border: '#f5c2c7' },
    warning: { bg: '#fff3cd', color: '#664d03', border: '#ffecb5' },
    info: { bg: '#cff4fc', color: '#055160', border: '#b6effb' },
    success: { bg: '#d1e7dd', color: '#0f5132', border: '#badbcc' }
  };

  const style = colorMap[severity] || colorMap.error;

  return (
    <div style={{ marginBottom: 8, border: `1px solid ${style.border}`, background: style.bg, color: style.color, borderRadius: 6, padding: '8px 12px' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div>{typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}</div>

      {error.stack && process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: 8 }}>
          <button 
            onClick={() => setExpanded(!expanded)}
            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 12 }}
          >
            {expanded ? 'Hide' : 'Show'} Stack Trace
          </button>
          {expanded && (
            <pre style={{ marginTop: 8, padding: 8, background: '#f7f7f7', borderRadius: 4, fontSize: '0.75rem', overflow: 'auto', maxHeight: 200 }}>
              {error.stack}
            </pre>
          )}
        </div>
      )}
      {showRetry && onRetry && (
        <div style={{ marginTop: 8 }}>
          <button onClick={onRetry} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 12 }}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
