import { Card, CardContent, Typography, Grid, Stack, Chip } from '@mui/material';

const ActiveJobs = ({ jobs = [] }) => {
  if (!jobs.length) {
    return <Typography color="text.secondary">No active jobs found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {jobs.map(j => (
        <Grid item xs={12} sm={6} key={j._id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{j.title}</Typography>
              <Typography variant="body2" color="text.secondary">{j.department}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip size="small" label={j.type} />
                <Chip size="small" label={j.location} />
                {j.postedBy?.username && <Chip size="small" label={`by ${j.postedBy.username}`} variant="outlined" />}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActiveJobs;


