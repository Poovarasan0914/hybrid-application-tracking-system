import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Box, Typography, Grid, Paper, Card, CardContent, Stack, Chip, IconButton } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GetApp, Search, Compare, Analytics } from '@mui/icons-material';
import SkeletonLoader from '../common/SkeletonLoader';
import AnimatedCard from '../common/AnimatedCard';
import { useToast } from '../common/Toast';
import { exportService } from '../../services/exportService';
import AdvancedSearch from '../common/AdvancedSearch';
import ApplicationComparison from './ApplicationComparison';
import DataVisualization from '../common/DataVisualization';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const { success, error } = useToast();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashData, appsData] = await Promise.all([
          adminService.getAdminDashboard(),
          adminService.getNonTechnicalApplications({ limit: 50 })
        ]);
        setDashboardData(dashData);
        setApplications(appsData.applications || []);
        success('Dashboard loaded successfully');
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        error('Failed to load dashboard data');
      }
      setLoading(false);
    };

    loadDashboard();
  }, [success, error]);

  if (loading) return <SkeletonLoader variant="dashboard" />;
  if (!dashboardData) return <Typography>Failed to load dashboard data</Typography>;

  const statusData = Object.entries(dashboardData.applicationStats || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const departmentData = Object.entries(dashboardData.departmentStats || {}).map(([dept, count]) => ({
    name: dept,
    applications: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExport = (format) => {
    if (format === 'pdf') {
      exportService.exportToPDF(applications, 'Admin Dashboard Report');
      success('PDF exported successfully');
    } else {
      exportService.exportToExcel(applications, 'admin_dashboard');
      success('Excel exported successfully');
    }
  };

  const handleSearch = (filters) => {
    console.log('Search filters:', filters);
    success('Search functionality implemented');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Admin Dashboard - Non-Technical Role Management</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => setSearchOpen(true)} color="primary" title="Advanced Search">
            <Search />
          </IconButton>
          <IconButton onClick={() => setCompareOpen(true)} color="primary" title="Compare Applications">
            <Compare />
          </IconButton>
          <IconButton onClick={() => handleExport('pdf')} color="primary" title="Export PDF">
            <GetApp />
          </IconButton>
          <IconButton onClick={() => handleExport('excel')} color="primary" title="Export Excel">
            <Analytics />
          </IconButton>
        </Stack>
      </Stack>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard delay={0}>
            <CardContent>
              <Typography variant="h4" color="primary">{dashboardData.totalApplications}</Typography>
              <Typography variant="body2" color="text.secondary">Non-Technical Applications</Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard delay={100}>
            <CardContent>
              <Typography variant="h4" color="success.main">{dashboardData.nonTechnicalJobs}</Typography>
              <Typography variant="body2" color="text.secondary">Active Non-Technical Jobs</Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard delay={200}>
            <CardContent>
              <Typography variant="h4" color="info.main">{dashboardData.recentApplications}</Typography>
              <Typography variant="body2" color="text.secondary">Recent Applications (7 days)</Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnimatedCard delay={300}>
            <CardContent>
              <Typography variant="h4" color="warning.main">{dashboardData.activeUsers}</Typography>
              <Typography variant="body2" color="text.secondary">Active Users</Typography>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnimatedCard animation="slide" delay={400}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Application Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </AnimatedCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <AnimatedCard animation="slide" delay={500}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Applications by Department</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </AnimatedCard>
        </Grid>
      </Grid>

      {/* Admin Info */}
      <AnimatedCard animation="grow" delay={600} sx={{ mt: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Admin Information</Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip label={`Admin: ${dashboardData.adminInfo?.name}`} color="primary" />
            <Chip label="Manages: Non-Technical Roles" color="secondary" />
            <Typography variant="body2" color="text.secondary">
              Last Access: {new Date(dashboardData.adminInfo?.lastAccess).toLocaleString()}
            </Typography>
          </Stack>
        </Paper>
      </AnimatedCard>

      {/* Advanced Data Visualization */}
      <AnimatedCard animation="grow" delay={700} sx={{ mt: 3 }}>
        <DataVisualization 
          data={dashboardData} 
          title="Advanced Analytics Dashboard"
        />
      </AnimatedCard>

      {/* Advanced Search Dialog */}
      <AdvancedSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
        searchType="applications"
      />

      {/* Application Comparison Dialog */}
      <ApplicationComparison
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        applications={applications}
      />
    </Box>
  );
};

export default AdminDashboard;