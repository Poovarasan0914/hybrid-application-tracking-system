
import { JOB_TYPES } from '../../utils/constants';

const JobFilters = ({ filters, onChange, onReset, onSearch }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <input
          type="text"
          placeholder="Search title or department"
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <input
          type="text"
          placeholder="Department (e.g. Engineering)"
          value={filters.department || ''}
          onChange={(e) => onChange({ ...filters, department: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ flex: 1, minWidth: '150px' }}>
        <select
          value={filters.type || ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: 'white'
          }}
        >
          <option value="">All Types</option>
          <option value={JOB_TYPES.FULL_TIME}>Full-time</option>
          <option value={JOB_TYPES.PART_TIME}>Part-time</option>
          <option value={JOB_TYPES.CONTRACT}>Contract</option>
          <option value={JOB_TYPES.INTERNSHIP}>Internship</option>
        </select>
      </div>

      <button 
        onClick={onSearch}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
      >
        Search
      </button>
      <button 
        onClick={onReset}
        style={{
          padding: '12px 24px',
          backgroundColor: 'transparent',
          color: '#1976d2',
          border: '1px solid #1976d2',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
      >
        Reset
      </button>
    </div>
  );
};

export default JobFilters;


