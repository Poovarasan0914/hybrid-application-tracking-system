import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { applicationSchema } from '../../utils/validators';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Box, Stack, TextField, Button, MenuItem, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../profile/UserProfile';

const ApplicationForm = ({ onSubmitted }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: { jobId: '', coverLetter: '', documents: [] }
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const loadJobs = async () => {
    try {
      const data = await jobService.getActiveJobs({ page: 1, limit: 50 });
      setJobs(data.jobs || []);
    } catch (e) {
      // non-blocking
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const isProfileComplete = () => {
    const profile = user?.profile;
    return profile?.firstName && profile?.lastName && profile?.phone && 
           profile?.experience !== undefined && profile?.skills?.length > 0;
  };

  const onSubmit = async (values) => {
    if (!isProfileComplete()) {
      setShowProfileDialog(true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        jobId: values.jobId,
        coverLetter: values.coverLetter,
        documents: []
      };
      await applicationService.submitApplication(payload);
      setSuccess('Application submitted successfully');
      reset();
      onSubmitted?.();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {!isProfileComplete() && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please complete your profile before applying for jobs.
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            select
            label="Select Job"
            fullWidth
            {...register('jobId')}
            error={!!errors.jobId}
            helperText={errors.jobId?.message}
          >
            {jobs.map((j) => (
              <MenuItem key={j._id} value={j._id}>{j.title} — {j.department}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Cover Letter"
            fullWidth
            multiline
            minRows={6}
            {...register('coverLetter')}
            error={!!errors.coverLetter}
            helperText={errors.coverLetter?.message}
          />

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
            <Button type="button" variant="text" onClick={() => reset()}>Reset</Button>
          </Stack>
        </Stack>
      </Box>

      <Dialog open={showProfileDialog} onClose={() => setShowProfileDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Complete Your Profile</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You need to complete your profile before applying for jobs. Please fill in the required fields below.
          </Alert>
          <UserProfile />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProfileDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApplicationForm;


