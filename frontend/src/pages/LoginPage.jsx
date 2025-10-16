import { Container, Typography, Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Login form will be implemented in Phase 3
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
