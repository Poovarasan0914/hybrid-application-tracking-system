import { Container, Typography, Box } from '@mui/material';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Registration form will be implemented in Phase 3
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
