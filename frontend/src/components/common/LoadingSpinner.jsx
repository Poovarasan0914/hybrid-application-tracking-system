import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';

// Loading spinner component with customizable options
const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...', 
  variant = 'circular', 
  fullScreen = false,
  color = 'primary'
}) => {
  const content = (
    <Box 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center"
      gap={2}
      sx={fullScreen ? { minHeight: '100vh' } : { py: 4 }}
    >
      {variant === 'circular' ? (
        <CircularProgress size={size} color={color} />
      ) : (
        <LinearProgress 
          sx={{ width: '100%', maxWidth: 200 }} 
          color={color}
        />
      )}
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
};

export default LoadingSpinner;
