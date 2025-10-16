import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Stack, Chip, Button } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PlaceIcon from '@mui/icons-material/Place';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jobService } from '../services/jobService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/helpers';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJob = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (e) {
      setError(e?.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <Container maxWidth="md"><Box sx={{ py: 4 }}><ErrorMessage error={error} onRetry={fetchJob} /></Box></Container>;
  if (!job) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <WorkOutlineIcon color="primary" />
          <Typography variant="h4" component="h1">
            {job.title}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={job.department} />
          <Chip label={job.type} color="info" />
          {job.postedBy?.username && (
            <Chip label={`by ${job.postedBy.username}`} variant="outlined" />
          )}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlaceIcon />
            <Typography>{job.location}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PaidIcon />
            <Typography>
              {formatCurrency(job.salary?.min, job.salary?.currency)} - {formatCurrency(job.salary?.max, job.salary?.currency)}
            </Typography>
          </Stack>
          <Typography color="text.secondary">Deadline: {formatDate(job.deadline)}</Typography>
        </Stack>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Description</Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{job.description}</Typography>

        {Array.isArray(job.requirements) && job.requirements.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Requirements</Typography>
            <Stack component="ul" sx={{ pl: 3 }}>
              {job.requirements.map((req, idx) => (
                <li key={idx}><Typography variant="body2">{req}</Typography></li>
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Container>
  );
};

export default JobDetailsPage;


