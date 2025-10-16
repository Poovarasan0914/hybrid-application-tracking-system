import { Card, CardContent, Typography, Grid } from '@mui/material';

const BotStats = ({ stats = [] }) => {
  const counts = stats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});

  const items = [
    { label: 'Pending', key: 'pending' },
    { label: 'Reviewing', key: 'reviewing' },
    { label: 'Shortlisted', key: 'shortlisted' },
    { label: 'Rejected', key: 'rejected' },
    { label: 'Accepted', key: 'accepted' }
  ];

  return (
    <Grid container spacing={2}>
      {items.map(item => (
        <Grid item xs={6} sm={4} md={2.4} key={item.key}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
              <Typography variant="h5">{counts[item.key] || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default BotStats;


