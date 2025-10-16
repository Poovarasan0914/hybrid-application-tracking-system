import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { botService } from '../services/botService';
import PendingApplications from '../components/bot/PendingApplications';
import BotStats from '../components/bot/BotStats';
import ActiveJobs from '../components/bot/ActiveJobs';

const BotPage = () => {
  const [data, setData] = useState({ pendingApplications: [], activeJobs: [], applicationStats: [] });

  const load = async () => {
    try {
      const res = await botService.getDashboard();
      setData({
        pendingApplications: res.pendingApplications || [],
        activeJobs: res.activeJobs || [],
        applicationStats: res.applicationStats || []
      });
    } catch {}
  };

  useEffect(() => { load(); }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bot Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Application Stats</Typography>
              <BotStats stats={data.applicationStats} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Pending Applications</Typography>
              <PendingApplications applications={data.pendingApplications} onOpen={() => {}} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Active Jobs</Typography>
              <ActiveJobs jobs={data.activeJobs} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BotPage;
