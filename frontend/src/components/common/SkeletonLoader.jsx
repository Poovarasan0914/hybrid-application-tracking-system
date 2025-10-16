const SkeletonLoader = ({ variant = 'card', count = 3 }) => {
  const shimmer = (
    <div style={{ background: 'linear-gradient(90deg, #eee, #f5f5f5, #eee)', backgroundSize: '200% 100%', animation: 'shimmer 1.2s infinite', height: 12, borderRadius: 4 }} />
  );

  const renderCardSkeleton = () => (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div style={{ width: '60%', height: 32, marginBottom: 8, background: '#eee', borderRadius: 4 }} />
      <div style={{ width: '40%', height: 20, marginBottom: 12, background: '#eee', borderRadius: 4 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 80, height: 24, background: '#eee', borderRadius: 4 }} />
        <div style={{ width: 60, height: 24, background: '#eee', borderRadius: 4 }} />
      </div>
      <div style={{ width: '100%', height: 60, background: '#eee', borderRadius: 4 }} />
    </div>
  );

  const renderTableSkeleton = () => (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: '12px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ width: '25%' }}>{shimmer}</div>
          <div style={{ width: '20%' }}>{shimmer}</div>
          <div style={{ width: 80 }}>{shimmer}</div>
          <div style={{ width: '15%' }}>{shimmer}</div>
        </div>
      ))}
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
            <div style={{ width: '40%', height: 48, marginBottom: 8, background: '#eee', borderRadius: 4 }} />
            <div style={{ width: '60%', height: 20, background: '#eee', borderRadius: 4 }} />
          </div>
        ))}
      </div>
      <div style={{ width: '100%', height: 300, background: '#eee', borderRadius: 8 }} />
    </div>
  );

  const content = variant === 'table' ? renderTableSkeleton() : variant === 'dashboard' ? renderDashboardSkeleton() : (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderCardSkeleton()}</div>
      ))}
    </div>
  );

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {content}
    </>
  );
};

export default SkeletonLoader;