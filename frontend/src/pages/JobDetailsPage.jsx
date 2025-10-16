import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Stack, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PlaceIcon from '@mui/icons-material/Place';
import PaidIcon from '@mui/icons-material/Paid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, formatDate } from '../utils/helpers';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

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

  useEffect(() => {
    const checkApplied = async () => {
      if (!isAuthenticated || user?.role !== 'applicant') {
        setAlreadyApplied(false);
        return;
      }
      try {
        const apps = await applicationService.getMyApplications();
        const found = Array.isArray(apps) && apps.some(a => (a.jobId?._id || a.jobId) === id);
        setAlreadyApplied(!!found);
      } catch {
        setAlreadyApplied(false);
      }
    };
    checkApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, user?.role]);

  const startApply = () => {
    if (!isAuthenticated || user?.role !== 'applicant') {
      setApplyError('Only applicants can apply. Please login as an applicant.');
      return;
    }
    if (alreadyApplied) {
      return;
    }
    setApplyOpen(true);
  };

  const handleApply = async () => {
    setApplyLoading(true);
    setApplyError('');
    setApplySuccess('');
    try {
      await applicationService.submitApplication({ jobId: id, coverLetter });
      setApplySuccess('Application submitted successfully');
      setAlreadyApplied(true);
      setApplyOpen(false);
      setCoverLetter('');
    } catch (e) {
      setApplyError(e?.response?.data?.message || e?.message || 'Failed to apply');
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (error) return <Container maxWidth="md"><Box sx={{ py: 4 }}><ErrorMessage error={error} onRetry={fetchJob} /></Box></Container>;
  if (!job) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {applyError && (
          <Typography color="error" sx={{ mb: 2 }}>{applyError}</Typography>
        )}
        {applySuccess && (
          <Typography color="success.main" sx={{ mb: 2 }}>{applySuccess}</Typography>
        )}

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
          {job.roleCategory && (
            <Chip label={job.roleCategory === 'technical' ? 'Technical' : 'Non-technical'} color={job.roleCategory === 'technical' ? 'success' : 'warning'} />
          )}
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
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" onClick={startApply} disabled={applyLoading || alreadyApplied}>
            {alreadyApplied ? 'Applied' : 'Apply for this job'}
          </Button>
        </Stack>

        <Dialog open={applyOpen} onClose={() => setApplyOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Application</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Please provide a brief cover letter (minimum 100 characters).
            </Typography>
            <TextField
              label="Cover Letter"
              fullWidth
              multiline
              minRows={6}
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
            {applyError && (
              <Typography color="error" sx={{ mt: 1 }}>{applyError}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleApply} disabled={applyLoading}>
              {applyLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default JobDetailsPage;


