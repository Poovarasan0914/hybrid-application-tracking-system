import { forwardRef } from 'react';

const AccessibleButton = forwardRef(({ 
  children, 
  ariaLabel, 
  tooltip, 
  disabled, 
  loading,
  ...props 
}, ref) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 12px',
    fontSize: '0.875rem',
    borderRadius: 6,
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface)',
    color: 'var(--text)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'background-color 150ms ease, box-shadow 150ms ease',
  };

  const button = (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      style={baseStyle}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );

  return tooltip ? (
    <span style={{ position: 'relative', display: 'inline-block' }} title={tooltip}>
      {button}
    </span>
  ) : button;
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;