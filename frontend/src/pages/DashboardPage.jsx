import { Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.username}! Your dashboard will be implemented in Phase 5.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;
