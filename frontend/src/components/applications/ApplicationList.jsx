import { useEffect, useState } from 'react';
import { applicationService } from '../../services/applicationService';
import { useNavigate } from 'react-router-dom';
import ApplicationStatus from './ApplicationStatus';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await applicationService.getMyApplications();
    setApplications(data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 8, fontSize: 20, color: 'var(--text)' }}>My Applications</h2>
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--surface)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Job Title</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Department</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>Applied Date</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(a => (
              <tr key={a._id} style={{ cursor: 'pointer' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{a.jobId?.title}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{a.jobId?.department}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}><ApplicationStatus status={a.status} /></td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>{new Date(a.submittedAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <button 
                    onClick={() => navigate(`/applications/${a._id}/timeline`)}
                    title="View Timeline"
                    style={{
                      padding: '6px 10px',
                      fontSize: 13,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--surface)',
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;