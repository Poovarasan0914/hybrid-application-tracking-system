const ActiveJobs = ({ jobs = [] }) => {
  if (!jobs.length) {
    return <div style={{ color: '#666' }}>No active jobs found.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
      {jobs.map(j => (
        <div key={j._id} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{j.title}</div>
          <div style={{ color: '#777', fontSize: 13 }}>{j.department}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#eee', fontSize: 12 }}>{j.type}</span>
            <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#eee', fontSize: 12 }}>{j.location}</span>
            {j.postedBy?.username && (
              <span style={{ padding: '2px 6px', borderRadius: 9999, background: '#fff', border: '1px solid #ddd', fontSize: 12 }}>{`by ${j.postedBy.username}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActiveJobs;


