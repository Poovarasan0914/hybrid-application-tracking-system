import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { applicationSchema } from '../../utils/validators';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { Box, Stack, TextField, Button, MenuItem, Alert } from '@mui/material';

const ApplicationForm = ({ onSubmitted }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: { jobId: '', coverLetter: '', documents: [] }
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const onSubmit = async (values) => {
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
  );
};

export default ApplicationForm;


