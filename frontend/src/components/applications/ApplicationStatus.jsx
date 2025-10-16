import { Chip } from '@mui/material';

const statusToColor = {
  pending: 'warning',
  reviewing: 'info',
  shortlisted: 'success',
  rejected: 'error',
  accepted: 'success'
};

const ApplicationStatus = ({ status }) => {
  const color = statusToColor[status] || 'default';
  const label = (status || '').charAt(0).toUpperCase() + (status || '').slice(1);
  return <Chip size="small" color={color} label={label || 'Unknown'} />;
};

export default ApplicationStatus;


