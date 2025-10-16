import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Box, Typography, Grid, Paper, Card, CardContent, Stack, Chip } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await adminService.getAdminDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
      }
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) return <Typography>Loading dashboard...</Typography>;
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

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>Admin Dashboard - Non-Technical Role Management</Typography>
      
      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">{dashboardData.totalApplications}</Typography>
              <Typography variant="body2" color="text.secondary">Non-Technical Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">{dashboardData.nonTechnicalJobs}</Typography>
              <Typography variant="body2" color="text.secondary">Active Non-Technical Jobs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main">{dashboardData.recentApplications}</Typography>
              <Typography variant="body2" color="text.secondary">Recent Applications (7 days)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">{dashboardData.activeUsers}</Typography>
              <Typography variant="body2" color="text.secondary">Active Users</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
        </Grid>

        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>

      {/* Admin Info */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Admin Information</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={`Admin: ${dashboardData.adminInfo?.name}`} color="primary" />
          <Chip label="Manages: Non-Technical Roles" color="secondary" />
          <Typography variant="body2" color="text.secondary">
            Last Access: {new Date(dashboardData.adminInfo?.lastAccess).toLocaleString()}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;