import { Box, Skeleton, Card, CardContent, Stack } from '@mui/material';

const SkeletonLoader = ({ variant = 'card', count = 3 }) => {
  const renderCardSkeleton = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </Stack>
        <Skeleton variant="text" width="100%" height={60} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );

  const renderTableSkeleton = () => (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <Stack key={i} direction="row" spacing={2} sx={{ py: 2, borderBottom: '1px solid #eee' }}>
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="text" width="15%" />
        </Stack>
      ))}
    </Box>
  );

  const renderDashboardSkeleton = () => (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} sx={{ flex: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={48} />
              <Skeleton variant="text" width="60%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Box>
  );

  if (variant === 'table') return renderTableSkeleton();
  if (variant === 'dashboard') return renderDashboardSkeleton();
  
  return (
    <Box>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderCardSkeleton()}</div>
      ))}
    </Box>
  );
};

export default SkeletonLoader;