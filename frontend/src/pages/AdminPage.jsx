import { Container, Typography, Box } from '@mui/material';

const AdminPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Admin dashboard will be implemented in Phase 6.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminPage;
