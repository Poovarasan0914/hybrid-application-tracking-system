import { Card, CardContent, CardActions, Typography, Chip, Stack, Button, Box } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PlaceIcon from '@mui/icons-material/Place';
import PaidIcon from '@mui/icons-material/Paid';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <WorkOutlineIcon color="primary" />
          <Typography variant="h6" component="div">
            {job.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={job.department} />
          <Chip size="small" label={job.type} color="info" />
          {job.postedBy?.username && (
            <Chip size="small" label={`by ${job.postedBy.username}`} variant="outlined" />
          )}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">{job.location}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PaidIcon fontSize="small" />
            <Typography variant="body2">
              {formatCurrency(job.salary?.min, job.salary?.currency)} - {formatCurrency(job.salary?.max, job.salary?.currency)}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Deadline: {formatDate(job.deadline)}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" variant="contained" onClick={() => navigate(`/jobs/${job._id}`)}>
          View details
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;


