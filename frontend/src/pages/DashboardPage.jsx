import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { applicationService } from '../services/applicationService';
import ApplicationList from '../components/applications/ApplicationList';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const load = async () => {
    try {
      const p = await authService.getProfile();
      setProfile(p);
    } catch {}
    try {
      const apps = await applicationService.getMyApplications();
      setApplications(apps || []);
    } catch {}
  };

  useEffect(() => {
    load();
  }, []);

  const handleRefresh = () => {
    load();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome, {user?.username}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <ApplicationList applications={applications} onView={handleRefresh} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Profile</Typography>
              <Typography variant="body2">Username: {profile?.username || user?.username}</Typography>
              <Typography variant="body2">Email: {profile?.email || user?.email}</Typography>
              <Typography variant="body2">Role: {profile?.role || user?.role}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
