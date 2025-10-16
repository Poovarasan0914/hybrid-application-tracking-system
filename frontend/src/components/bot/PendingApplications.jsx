import { formatDateTime } from '../../utils/helpers';

const PendingApplications = ({ applications = [], onOpen }) => {
  if (!applications.length) {
    return <div style={{ color: '#666' }}>No pending technical applications. All technical roles will be auto-processed! 🤖</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      {applications.map((a) => (
        <div key={a._id} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{a.jobId?.title}</span>
                <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#e7f1ff', border: '1px solid #cfe2ff', fontSize: 12 }}>Technical</span>
              </div>
              <div style={{ color: '#777', fontSize: 13 }}>{a.jobId?.department} • {a.jobId?.type}</div>
              <div style={{ color: '#777', fontSize: 13 }}>Applicant: {a.applicantId?.username} ({a.applicantId?.email})</div>
              <div style={{ color: '#777', fontSize: 13 }}>Submitted: {formatDateTime(a.submittedAt)}</div>
              <div style={{ color: '#1976d2', fontSize: 13 }}>🤖 Ready for auto-processing</div>
            </div>
            <div>
              <button onClick={() => onOpen?.(a._id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: 12 }}>View Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingApplications;


