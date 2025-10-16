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
  }, []);

  const handleReset = () => {
    setFilters({ type: '', department: '', search: '' });
    fetchJobs(1);
  };

  const handleSearch = () => {
    fetchJobs(1);
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 20px'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#1f2937',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          Available Jobs
        </h1>

        <JobFilters 
          filters={filters} 
          onChange={setFilters} 
          onReset={handleReset} 
          onSearch={handleSearch} 
        />

        {loading && <LoadingSpinner fullScreen={false} />}
        {error && <ErrorMessage error={error} onRetry={() => fetchJobs(pagination.page)} />}

        {!loading && !error && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {jobs.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '3rem 0',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '1.125rem' }}>No jobs found matching your criteria</p>
              </div>
            )}

            {jobs.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '2rem'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  {[...Array(pagination.totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => handlePageChange(idx + 1)}
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: idx + 1 === pagination.page ? 'none' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: idx + 1 === pagination.page ? '#2563eb' : '#ffffff',
                        color: idx + 1 === pagination.page ? '#ffffff' : '#374151',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        if (idx + 1 !== pagination.page) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (idx + 1 !== pagination.page) {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
