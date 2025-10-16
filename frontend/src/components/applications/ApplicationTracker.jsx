import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { formatDateTime } from '../../utils/helpers';
import ApplicationStatus from './ApplicationStatus';

const ApplicationTracker = () => {
  const { id } = useParams();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        console.log('Loading timeline for application:', id);
        const data = await applicationService.getApplicationTimeline(id);
        console.log('Timeline data:', data);
        setTimeline(data);
      } catch (err) {
        console.error('Timeline error:', err);
        setError(err.response?.data?.message || 'Failed to load application timeline');
      }
      setLoading(false);
    };

    if (id) loadTimeline();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ padding: '8px 12px', background: '#fde7e9', color: '#7a1320', border: '1px solid #f8c7cf', borderRadius: 6 }}>{error}</div>;
  if (!timeline) return <div style={{ padding: '8px 12px', background: '#fff3cd', color: '#6c4a00', border: '1px solid #ffecb5', borderRadius: 6 }}>Application not found</div>;

  const { application, timeline: events } = timeline;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ padding: 16, marginBottom: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{application.job.title}</h3>
          <ApplicationStatus status={application.status} />
        </div>
        <div style={{ color: '#666', fontSize: 12 }}>
          Applied: {formatDateTime(application.submittedAt)} | Last Updated: {formatDateTime(application.lastUpdated)}
        </div>
        <div style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', fontSize: 12, borderRadius: 9999, background: '#e7f1ff', color: '#113a76', border: '1px solid #cfe2ff' }}>
          {application.job.roleCategory || 'Unknown'}
        </div>
      </div>

      <div style={{ padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Application Timeline</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {events.map((event, index) => (
            <li key={index} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: event.type === 'submission' ? '#e7f1ff' : event.type === 'status_change' ? '#e8f5e9' : '#e3f2fd'
              }}>
                <span style={{ fontSize: 16 }}>
                  {event.type === 'submission' ? '📝' : event.type === 'status_change' ? '🔄' : '💬'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{event.title}</strong>
                  <span style={{ color: '#777', fontSize: 11 }}>{formatDateTime(event.timestamp)}</span>
                </div>
                <div style={{ marginTop: 4, fontSize: 13 }}>{event.description}</div>
                <div style={{ color: '#777', fontSize: 11 }}>by {event.user}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApplicationTracker;