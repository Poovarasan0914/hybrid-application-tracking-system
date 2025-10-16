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
  const [mimicStats, setMimicStats] = useState(null);
  const [mimicProcessing, setMimicProcessing] = useState(false);

  const load = async () => {
    try {
      const res = await botService.getDashboard();
      setData({
        pendingApplications: res.pendingApplications || [],
        activeJobs: res.activeJobs || [],
        applicationStats: res.applicationStats || []
      });
      
      // Load Bot Mimic stats
      const mimicRes = await botService.getBotMimicStats();
      setMimicStats(mimicRes);
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

  const handleBotMimicTrigger = async () => {
    setMimicProcessing(true);
    try {
      const res = await botService.triggerBotMimic();
      setMessage(`🎯 Bot Mimic: ${res.message}`);
      await load();
    } catch (err) {
      setMessage('Failed to trigger Bot Mimic');
    }
    setMimicProcessing(false);
  };

  const handleToggleBotMimic = async (action) => {
    try {
      const res = await botService.toggleBotMimic(action);
      setMessage(`🎯 Bot Mimic ${action}ed successfully`);
      await load();
    } catch (err) {
      setMessage(`Failed to ${action} Bot Mimic`);
    }
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
          <Stack direction="row" spacing={1}>
            <Button 
              variant={autoMode ? "contained" : "outlined"}
              onClick={() => setAutoMode(!autoMode)}
              color={autoMode ? "success" : "default"}
              size="small"
            >
              {autoMode ? '🤖 Auto Mode ON' : '⏸️ Auto Mode OFF'}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleManualProcess}
              disabled={processing}
              color="primary"
              size="small"
            >
              {processing ? 'Processing...' : 'Process Now'}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleBotMimicTrigger}
              disabled={mimicProcessing}
              color="secondary"
              size="small"
            >
              {mimicProcessing ? 'Mimicking...' : '🎯 Bot Mimic'}
            </Button>
          </Stack>
        </Stack>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          <Alert severity={autoMode ? "success" : "warning"}>
            <strong>Bot Status:</strong> {autoMode ? '🤖 Automatically processing technical applications every 30 seconds' : '⏸️ Auto-processing paused - use manual processing'}
          </Alert>
          <Alert severity="info">
            <strong>Bot Mimic:</strong> {mimicStats?.isRunning ? '🎯 Human-like workflow processing active (Applied → Reviewed → Interview → Offer)' : '⏸️ Bot Mimic paused'}
            {mimicStats && ` | Total Technical Apps: ${mimicStats.totalTechnicalApplications}`}
          </Alert>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Technical Application Stats</Typography>
              <BotStats stats={data.applicationStats} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Bot Mimic Workflow Stats</Typography>
              {mimicStats?.stageDistribution && (
                <Stack spacing={1}>
                  {Object.entries(mimicStats.stageDistribution).map(([stage, count]) => (
                    <Stack key={stage} direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{stage}:</Typography>
                      <Typography variant="body2" fontWeight="bold">{count}</Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
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
