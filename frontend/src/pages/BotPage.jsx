import { Container, Typography, Box } from '@mui/material';

const BotPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bot Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bot dashboard will be implemented in Phase 7.
        </Typography>
      </Box>
    </Container>
  );
};

export default BotPage;
