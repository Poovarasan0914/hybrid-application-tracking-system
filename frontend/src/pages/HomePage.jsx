import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Application Tracking System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Streamline your job application process with our comprehensive ATS platform
        </Typography>
        
        {isAuthenticated ? (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Welcome back, {user?.username}!
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'bot' ? '/bot' : '/dashboard')}
              sx={{ mr: 2 }}
            >
              Go to {user?.role === 'admin' ? 'Admin' : user?.role === 'bot' ? 'Bot' : 'Dashboard'}
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
