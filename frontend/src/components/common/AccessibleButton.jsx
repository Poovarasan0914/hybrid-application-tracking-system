import { Button, Tooltip } from '@mui/material';
import { forwardRef } from 'react';

const AccessibleButton = forwardRef(({ 
  children, 
  ariaLabel, 
  tooltip, 
  disabled, 
  loading,
  ...props 
}, ref) => {
  const button = (
    <Button
      ref={ref}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      <span>{button}</span>
    </Tooltip>
  ) : button;
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;