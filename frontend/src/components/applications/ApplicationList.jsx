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
      <h2 style={{ marginBottom: 8 }}>My Applications</h2>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f7f7f7', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Job Title</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Department</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Status</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0' }}>Applied Date</th>
              <th style={{ padding: '10px 12px', borderBottom: '1px solid #e0e0e0', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(a => (
              <tr key={a._id} style={{ cursor: 'pointer' }}>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{a.jobId?.title}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{a.jobId?.department}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}><ApplicationStatus status={a.status} /></td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>{new Date(a.submittedAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>
                  <button 
                    onClick={() => navigate(`/applications/${a._id}/timeline`)}
                    title="View Timeline"
                    style={{
                      padding: '4px 8px',
                      fontSize: 12,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
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