import { Container, Typography, Box } from '@mui/material';

const JobsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job listings will be implemented in Phase 4.
        </Typography>
      </Box>
    </Container>
  );
};

export default JobsPage;
