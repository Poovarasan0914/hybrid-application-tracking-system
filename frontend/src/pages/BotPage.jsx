import { Container, Typography, Box, Grid, Paper, Button, Alert, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { botService } from '../services/botService';
import PendingApplications from '../components/bot/PendingApplications';
import BotStats from '../components/bot/BotStats';
import ActiveJobs from '../components/bot/ActiveJobs';

const BotPage = () => {
  const [data, setData] = useState({ pendingApplications: [], activeJobs: [], applicationStats: [] });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [autoMode, setAutoMode] = useState(true);

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

  const processApplications = async () => {
    if (processing) return;
    
    setProcessing(true);
    try {
      const res = await botService.autoProcessTechnical();
      if (res.processed > 0) {
        setMessage(`🤖 Auto-processed ${res.processed} technical applications`);
        await load();
      }
    } catch (err) {
      setMessage('Failed to process applications');
    }
    setProcessing(false);
  };

  const handleManualProcess = async () => {
    await processApplications();
  };

  useEffect(() => {
    load();
    
    // Auto-process every 30 seconds when in auto mode
    const interval = setInterval(() => {
      if (autoMode && !processing) {
        processApplications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoMode, processing]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Bot Dashboard - Technical Roles Only
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button 
              variant={autoMode ? "contained" : "outlined"}
              onClick={() => setAutoMode(!autoMode)}
              color={autoMode ? "success" : "default"}
            >
              {autoMode ? '🤖 Auto Mode ON' : '⏸️ Auto Mode OFF'}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleManualProcess}
              disabled={processing}
              color="primary"
            >
              {processing ? 'Processing...' : 'Process Now'}
            </Button>
          </Stack>
        </Stack>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Alert severity={autoMode ? "success" : "warning"} sx={{ mb: 3 }}>
          <strong>Bot Status:</strong> {autoMode ? '🤖 Automatically processing technical applications every 30 seconds' : '⏸️ Auto-processing paused - use manual processing'}
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Technical Application Stats</Typography>
              <BotStats stats={data.applicationStats} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Pending Technical Applications</Typography>
              <PendingApplications applications={data.pendingApplications} onOpen={() => {}} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Active Technical Jobs</Typography>
              <ActiveJobs jobs={data.activeJobs} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BotPage;
