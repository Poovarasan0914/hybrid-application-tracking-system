import { Card, CardContent, Typography, Grid, Stack, Button } from '@mui/material';
import ApplicationStatus from './ApplicationStatus';
import { formatDateTime } from '../../utils/helpers';

const ApplicationList = ({ applications = [], onView }) => {
  if (!applications.length) {
    return <Typography color="text.secondary">No applications yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {applications.map(app => (
        <Grid item xs={12} key={app._id}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack>
                  <Typography variant="h6">{app.jobId?.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{app.jobId?.department}</Typography>
                  <Typography variant="body2" color="text.secondary">Submitted: {formatDateTime(app.submittedAt)}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ApplicationStatus status={app.status} />
                  <Button size="small" onClick={() => onView?.(app._id)}>View</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ApplicationList;


