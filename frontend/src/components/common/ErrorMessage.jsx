import { Alert, AlertTitle, Box, Button, Collapse } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';
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

  return (
    <Alert 
      severity={severity} 
      variant={variant}
      action={
        showRetry && onRetry && (
          <Button 
            color="inherit" 
            size="small" 
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        )
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>{title}</AlertTitle>
      {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
      
      {error.stack && process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 1 }}>
          <Button 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ textTransform: 'none' }}
          >
            {expanded ? 'Hide' : 'Show'} Stack Trace
          </Button>
          <Collapse in={expanded}>
            <Box 
              component="pre" 
              sx={{ 
                mt: 1, 
                p: 1, 
                bgcolor: 'grey.100', 
                borderRadius: 1, 
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 200
              }}
            >
              {error.stack}
            </Box>
          </Collapse>
        </Box>
      )}
    </Alert>
  );
};

export default ErrorMessage;
