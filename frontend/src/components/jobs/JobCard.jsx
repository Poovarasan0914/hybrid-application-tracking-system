
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100%',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '16px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: '#1976d2' }}>💼</span>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '500' }}>
            {job.title}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 8px', backgroundColor: '#e3f2fd', borderRadius: '16px', fontSize: '0.75rem' }}>
            {job.department}
          </span>
          <span style={{ padding: '4px 8px', backgroundColor: '#e1f5fe', borderRadius: '16px', fontSize: '0.75rem' }}>
            {job.type}
          </span>
          {job.roleCategory && (
            <span style={{ 
              padding: '4px 8px', 
              backgroundColor: job.roleCategory === 'technical' ? '#e8f5e8' : '#fff3e0', 
              borderRadius: '16px', 
              fontSize: '0.75rem' 
            }}>
              {job.roleCategory === 'technical' ? 'Technical' : 'Non-technical'}
            </span>
          )}
          {job.postedBy?.username && (
            <span style={{ padding: '4px 8px', border: '1px solid #e0e0e0', borderRadius: '16px', fontSize: '0.75rem' }}>
              by {job.postedBy.username}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📍</span>
            <span style={{ fontSize: '0.875rem' }}>{job.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>💰</span>
            <span style={{ fontSize: '0.875rem' }}>
              {formatCurrency(job.salary?.min, job.salary?.currency)} - {formatCurrency(job.salary?.max, job.salary?.currency)}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '8px' }}>
          Deadline: {formatDate(job.deadline)}
        </p>

        <p style={{ 
          fontSize: '0.875rem', 
          color: '#666', 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          margin: 0
        }}>
          {job.description}
        </p>
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => navigate(`/jobs/${job._id}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
        >
          View details
        </button>
      </div>
    </div>
  );
};

export default JobCard;


