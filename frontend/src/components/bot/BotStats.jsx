const BotStats = ({ stats = [] }) => {
  const counts = stats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {});

  const items = [
    { label: 'Pending', key: 'pending' },
    { label: 'Reviewing', key: 'reviewing' },
    { label: 'Shortlisted', key: 'shortlisted' },
    { label: 'Rejected', key: 'rejected' },
    { label: 'Accepted', key: 'accepted' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
      {items.map(item => (
        <div key={item.key} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
          <div style={{ color: '#777', fontSize: 12 }}>{item.label}</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{counts[item.key] || 0}</div>
        </div>
      ))}
    </div>
  );
};

export default BotStats;


