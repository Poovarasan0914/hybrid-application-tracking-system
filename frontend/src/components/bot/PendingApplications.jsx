import { Card, CardContent, Typography, Grid, Stack, Button, Chip } from '@mui/material';
import { formatDateTime } from '../../utils/helpers';

const PendingApplications = ({ applications = [], onOpen }) => {
  if (!applications.length) {
    return <Typography color="text.secondary">No pending technical applications. All technical roles will be auto-processed! 🤖</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {applications.map((a) => (
        <Grid item xs={12} key={a._id}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="h6">{a.jobId?.title}</Typography>
                    <Chip label="Technical" color="primary" size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{a.jobId?.department} • {a.jobId?.type}</Typography>
                  <Typography variant="body2" color="text.secondary">Applicant: {a.applicantId?.username} ({a.applicantId?.email})</Typography>
                  <Typography variant="body2" color="text.secondary">Submitted: {formatDateTime(a.submittedAt)}</Typography>
                  <Typography variant="body2" color="primary">🤖 Ready for auto-processing</Typography>
                </Stack>
                <Button size="small" variant="outlined" onClick={() => onOpen?.(a._id)}>View Details</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PendingApplications;


