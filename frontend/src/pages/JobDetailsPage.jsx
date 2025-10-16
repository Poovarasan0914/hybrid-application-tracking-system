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

  const formatSalaryDisplay = (salary) => {
    if (salary === null || salary === undefined) return 'Not specified';
    if (typeof salary === 'number') return formatCurrency(salary);
    if (typeof salary === 'string') {
      const parsed = parseFloat(salary);
      return Number.isFinite(parsed) ? formatCurrency(parsed) : salary;
    }
    const currency = salary.currency || 'USD';
    const min = salary.min !== undefined && salary.min !== null ? Number(salary.min) : undefined;
    const max = salary.max !== undefined && salary.max !== null ? Number(salary.max) : undefined;
    const hasMin = Number.isFinite(min);
    const hasMax = Number.isFinite(max);
    if (hasMin && hasMax) return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
    if (hasMin) return `${formatCurrency(min, currency)}+`;
    if (hasMax) return `Up to ${formatCurrency(max, currency)}`;
    return 'Not specified';
  };

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
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <ErrorMessage error={error} onRetry={fetchJob} />
    </div>
  );
  if (!job) return null;

  return (
    <div className="container" style={{ maxWidth: '900px', paddingTop: '24px', paddingBottom: '24px' }}>
      {applyError && (
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--danger-100)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: 'var(--danger-600)',
          marginBottom: '24px',
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
              color: 'var(--danger-600)',
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
          padding: '16px',
          backgroundColor: 'var(--success-100)',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          color: 'var(--success-600)',
          marginBottom: '24px',
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
              color: 'var(--success-600)',
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
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--primary-600)',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--primary-700)';
          e.currentTarget.style.backgroundColor = 'var(--primary-100)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--primary-600)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <span style={{ marginRight: '0.5rem' }}>←</span>
        Back to Jobs
      </button>

      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'var(--text)',
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          {job.title}
        </h1>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.95rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>📍</span>
            {job.location}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.95rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>💼</span>
            {job.type}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.95rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>💰</span>
            {formatSalaryDisplay(job.salary)}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {job.skills?.map((skill, index) => (
            <span
              key={index}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                border: '1px solid var(--primary-200)',
                borderRadius: '9999px',
                fontSize: '0.9rem'
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: 'var(--text)',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            Description
          </h2>
          <div style={{
            color: 'var(--text-muted)',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap'
          }}>
            {job.description}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            color: 'var(--text)',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            Requirements
          </h2>
          <div style={{
            color: 'var(--text-muted)',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap'
          }}>
            {job.requirements}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{
            color: 'var(--text-subtle)',
            fontSize: '0.95rem'
          }}>
            Posted on {formatDate(job.createdAt)}
          </div>
          {!alreadyApplied ? (
            <button
              onClick={startApply}
              disabled={!isAuthenticated || user?.role !== 'applicant'}
              style={{
                padding: '12px 20px',
                backgroundColor: 'var(--primary-600)',
                color: '#ffffff',
                border: '1px solid var(--primary-600)',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: (!isAuthenticated || user?.role !== 'applicant') ? 'not-allowed' : 'pointer',
                opacity: (!isAuthenticated || user?.role !== 'applicant') ? '0.7' : '1',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                if (isAuthenticated && user?.role === 'applicant') {
                  e.currentTarget.style.backgroundColor = 'var(--primary-700)';
                }
              }}
              onMouseOut={(e) => {
                if (isAuthenticated && user?.role === 'applicant') {
                  e.currentTarget.style.backgroundColor = 'var(--primary-600)';
                }
              }}
            >
              Apply Now
            </button>
          ) : (
            <div style={{
              padding: '12px 20px',
              backgroundColor: 'var(--success-100)',
              color: 'var(--success-600)',
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
          padding: '16px',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: 'var(--shadow-lg)'
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
                  marginBottom: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
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
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setApplyOpen(false);
                  setCoverLetter('');
                }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-2)';
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
                  padding: '10px 14px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  border: '1px solid var(--primary-600)',
                  borderRadius: '8px',
                  fontWeight: '500',
                  cursor: applyLoading ? 'not-allowed' : 'pointer',
                  opacity: applyLoading ? '0.7' : '1'
                }}
                onMouseOver={(e) => {
                  if (!applyLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-700)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!applyLoading) {
                    e.currentTarget.style.backgroundColor = 'var(--primary-600)';
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


