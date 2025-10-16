import { Container, Typography, Box, Grid, Pagination, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import { jobService } from '../services/jobService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const JobsPage = () => {
  const [filters, setFilters] = useState({ type: '', department: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 9, totalPages: 1, total: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: pagination.limit };
      if (filters.type) params.type = filters.type;
      if (filters.department) params.department = filters.department;
      // Simple client-side search over results after fetch (backend has no search param)
      const data = await jobService.getActiveJobs(params);
      const sourceJobs = data.jobs || [];
      const filtered = filters.search
        ? sourceJobs.filter(j =>
            (j.title || '').toLowerCase().includes(filters.search.toLowerCase()) ||
            (j.department || '').toLowerCase().includes(filters.search.toLowerCase())
          )
        : sourceJobs;
      setJobs(filtered);
      setPagination({ page: data.currentPage, limit: pagination.limit, totalPages: data.totalPages, total: data.totalJobs });
    } catch (e) {
      setError(e?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setFilters({ type: '', department: '', search: '' });
    fetchJobs(1);
  };

  const handleSearch = () => {
    fetchJobs(1);
  };

  const handlePageChange = (_e, page) => {
    fetchJobs(page);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Jobs
        </Typography>

        <JobFilters filters={filters} onChange={setFilters} onReset={handleReset} onSearch={handleSearch} />

        {loading && <LoadingSpinner fullScreen={false} />}
        {error && <ErrorMessage error={error} onRetry={() => fetchJobs(pagination.page)} />}

        {!loading && !error && (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {jobs.map(job => (
                <Grid item xs={12} sm={6} md={4} key={job._id}>
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>

            <Stack alignItems="center" sx={{ mt: 3 }}>
              <Pagination 
                count={pagination.totalPages || 1}
                page={pagination.page || 1}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Box>
    </Container>
  );
};

export default JobsPage;
