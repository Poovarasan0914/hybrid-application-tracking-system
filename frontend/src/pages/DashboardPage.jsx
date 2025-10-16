import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ApplicationList from '../components/applications/ApplicationList';
import UserProfile from '../components/profile/UserProfile';

const DashboardPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome, {user?.username}
        </Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="My Applications" />
            <Tab label="Profile" />
          </Tabs>

          {tab === 0 && <ApplicationList />}
          {tab === 1 && <UserProfile />}
        </Paper>
      </Box>
    </Container>
  );
};

export default DashboardPage;
