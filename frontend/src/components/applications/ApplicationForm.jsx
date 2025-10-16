import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { applicationSchema } from '../../utils/validators';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && <div style={{ marginBottom: 8, padding: '8px 12px', background: '#fde7e9', color: '#7a1320', border: '1px solid #f8c7cf', borderRadius: 6 }}>{error}</div>}
        {success && <div style={{ marginBottom: 8, padding: '8px 12px', background: '#e6f4ea', color: '#0f5132', border: '1px solid #badbcc', borderRadius: 6 }}>{success}</div>}
        {!isProfileComplete() && (
          <div style={{ marginBottom: 8, padding: '8px 12px', background: '#fff3cd', color: '#6c4a00', border: '1px solid #ffecb5', borderRadius: 6 }}>
            Please complete your profile before applying for jobs.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label htmlFor="jobId" style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Select Job</label>
            <select id="jobId" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }} {...register('jobId')}> 
              <option value="">-- Select --</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title} — {j.department}</option>
              ))}
            </select>
            {errors.jobId && <div style={{ color: '#b3261e', fontSize: 12, marginTop: 4 }}>{errors.jobId.message}</div>}
          </div>

          <div>
            <label htmlFor="coverLetter" style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Cover Letter</label>
            <textarea id="coverLetter" rows={6} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }} {...register('coverLetter')} />
            {errors.coverLetter && <div style={{ color: '#b3261e', fontSize: 12, marginTop: 4 }}>{errors.coverLetter.message}</div>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #1976d2', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type="button" onClick={() => reset()} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>
              Reset
            </button>
          </div>
        </div>
      </form>

      {showProfileDialog && (
        <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 800, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600 }}>Complete Your Profile</div>
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 12, padding: '8px 12px', background: '#e7f1ff', color: '#113a76', border: '1px solid #cfe2ff', borderRadius: 6 }}>
                You need to complete your profile before applying for jobs. Please fill in the required fields below.
              </div>
              <UserProfile />
            </div>
            <div style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProfileDialog(false)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;


