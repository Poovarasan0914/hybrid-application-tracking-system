import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  if (error) return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 20px' }}>
      <ErrorMessage error={error} onRetry={fetchJob} />
    </div>
  );
  if (!job) return null;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 20px'
    }}>
      {applyError && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{applyError}</span>
          <button 
            onClick={() => setApplyError('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      {applySuccess && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          color: '#15803d',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{applySuccess}</span>
          <button 
            onClick={() => setApplySuccess('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#15803d',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ×
          </button>
        </div>
      )}

      <button 
        onClick={() => navigate('/jobs')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#2563eb',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#1d4ed8';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#2563eb';
        }}
      >
        <span style={{ marginRight: '0.5rem' }}>←</span>
        Back to Jobs
      </button>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2.25rem',
          color: '#1f2937',
          marginBottom: '1rem',
          fontWeight: '600'
        }}>
          {job.title}
        </h1>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            fontSize: '0.875rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>📍</span>
            {job.location}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            fontSize: '0.875rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>💼</span>
            {job.type}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#4b5563',
            fontSize: '0.875rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>💰</span>
            {formatCurrency(job.salary)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {job.skills?.map((skill, index) => (
            <span
              key={index}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: '#374151',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Description
          </h2>
          <div style={{
            color: '#4b5563',
            lineHeight: '1.625',
            whiteSpace: 'pre-wrap'
          }}>
            {job.description}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: '#374151',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Requirements
          </h2>
          <div style={{
            color: '#4b5563',
            lineHeight: '1.625',
            whiteSpace: 'pre-wrap'
          }}>
            {job.requirements}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Posted on {formatDate(job.createdAt)}
          </div>
          {!alreadyApplied ? (
            <button
              onClick={startApply}
              disabled={!isAuthenticated || user?.role !== 'applicant'}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: (!isAuthenticated || user?.role !== 'applicant') ? 'not-allowed' : 'pointer',
                opacity: (!isAuthenticated || user?.role !== 'applicant') ? '0.7' : '1',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (isAuthenticated && user?.role === 'applicant') {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseOut={(e) => {
                if (isAuthenticated && user?.role === 'applicant') {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              Apply Now
            </button>
          ) : (
            <div style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              borderRadius: '8px',
              fontWeight: '500'
            }}>
              Already Applied
            </div>
          )}
        </div>
      </div>

      {applyOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontWeight: '600'
            }}>
              Apply for {job.title}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="coverLetter"
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  setApplyOpen(false);
                  setCoverLetter('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applyLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: applyLoading ? 'not-allowed' : 'pointer',
                  opacity: applyLoading ? '0.7' : '1'
                }}
                onMouseOver={(e) => {
                  if (!applyLoading) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!applyLoading) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;


