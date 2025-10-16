import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          403 - Unauthorized
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
