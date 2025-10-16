const statusToStyle = {
  pending: { backgroundColor: '#fff3cd', color: '#6c4a00', borderColor: '#ffecb5' },
  reviewing: { backgroundColor: '#cff4fc', color: '#055160', borderColor: '#b6effb' },
  shortlisted: { backgroundColor: '#d1e7dd', color: '#0f5132', borderColor: '#badbcc' },
  rejected: { backgroundColor: '#f8d7da', color: '#842029', borderColor: '#f5c2c7' },
  accepted: { backgroundColor: '#d1e7dd', color: '#0f5132', borderColor: '#badbcc' }
};

const ApplicationStatus = ({ status }) => {
  const baseStyle = {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '12px',
    borderRadius: '9999px',
    border: '1px solid transparent'
  };
  const style = { ...baseStyle, ...(statusToStyle[status] || { backgroundColor: '#eee', color: '#333', borderColor: '#ddd' }) };
  const label = (status || 'Unknown').replace(/^./, c => c.toUpperCase());
  return <span style={style}>{label}</span>;
};

export default ApplicationStatus;


