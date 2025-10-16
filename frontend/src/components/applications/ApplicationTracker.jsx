import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { Box, Typography, Paper, Card, CardContent, Chip, Stack, Alert, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { formatDateTime } from '../../utils/helpers';
import ApplicationStatus from './ApplicationStatus';

const ApplicationTracker = () => {
  const { id } = useParams();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        console.log('Loading timeline for application:', id);
        const data = await applicationService.getApplicationTimeline(id);
        console.log('Timeline data:', data);
        setTimeline(data);
      } catch (err) {
        console.error('Timeline error:', err);
        setError(err.response?.data?.message || 'Failed to load application timeline');
      }
      setLoading(false);
    };

    if (id) loadTimeline();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!timeline) return <Alert severity="warning">Application not found</Alert>;

  const { application, timeline: events } = timeline;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">{application.job.title}</Typography>
          <ApplicationStatus status={application.status} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Applied: {formatDateTime(application.submittedAt)} | Last Updated: {formatDateTime(application.lastUpdated)}
        </Typography>
        <Chip 
          label={application.job.roleCategory || 'Unknown'} 
          color={application.job.roleCategory === 'technical' ? 'primary' : 'secondary'}
          size="small"
          sx={{ mt: 1 }}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Application Timeline</Typography>
        <List>
          {events.map((event, index) => (
            <ListItem key={index} alignItems="flex-start">
              <Avatar sx={{ 
                bgcolor: event.type === 'submission' ? 'primary.main' :
                        event.type === 'status_change' ? 'success.main' : 'info.main',
                mr: 2, mt: 1
              }}>
                {event.type === 'submission' ? '📝' :
                 event.type === 'status_change' ? '🔄' : '💬'}
              </Avatar>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">{event.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(event.timestamp)}
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {event.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {event.user}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ApplicationTracker;