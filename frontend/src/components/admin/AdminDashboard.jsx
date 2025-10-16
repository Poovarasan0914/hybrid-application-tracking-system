// React hooks for state management and lifecycle
import { useEffect, useState } from 'react';

// Service layer for admin-related API calls
import { adminService } from '../../services/adminService';



// Recharts library for interactive data visualization
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom components for enhanced UX
import LoadingSpinner from '../common/LoadingSpinner';  // Loading state component
import { useToast } from '../common/Toast';             // Toast notification system

/**
 * AdminDashboard Component
 * 
 * Provides comprehensive analytics and metrics for admin users including:
 * - Application statistics with interactive charts
 * - Key performance indicators (KPIs)
 * - Department-wise application distribution
 * - Real-time data updates
 */
const AdminDashboard = () => {
  // State management for dashboard data and loading states
  const [dashboardData, setDashboardData] = useState(null);  // Stores all dashboard metrics
  const [loading, setLoading] = useState(true);              // Loading state for skeleton display
  const { success, error } = useToast();                     // Toast notifications for user feedback

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await adminService.getAdminDashboard();
        setDashboardData(data);
        success('Dashboard loaded successfully');
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
        error('Failed to load dashboard data');
      }
      setLoading(false);
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove success and error from dependencies to prevent unnecessary re-renders

  if (loading) return <LoadingSpinner />;
  if (!dashboardData) return <div style={{ padding: '20px', fontSize: '16px', color: '#666' }}>Failed to load dashboard data</div>;

  const statusData = Object.entries(dashboardData.applicationStats || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count
  }));

  const departmentData = Object.entries(dashboardData.departmentStats || {}).map(([dept, count]) => ({
    name: dept,
    applications: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 16px 0',
    fontFamily: 'Arial, sans-serif'
  };

  const numberStyle = {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    fontFamily: 'Arial, sans-serif'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#666',
    margin: '0',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div style={{ padding: '20px', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Admin Dashboard</h1>
      
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={cardStyle}>
          <div style={{ ...numberStyle, color: '#1976d2' }}>{dashboardData.totalApplications || 0}</div>
          <div style={labelStyle}>Total Applications</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...numberStyle, color: '#2e7d32' }}>{dashboardData.totalJobs || 0}</div>
          <div style={labelStyle}>Active Jobs</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...numberStyle, color: '#0288d1' }}>{dashboardData.recentApplications || 0}</div>
          <div style={labelStyle}>Recent Applications (7 days)</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...numberStyle, color: '#f57c00' }}>{dashboardData.activeUsers || 0}</div>
          <div style={labelStyle}>Active Users</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Application Status Distribution</h3>
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
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Applications by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="applications" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admin Info */}
      <div style={{ ...cardStyle, marginTop: '24px' }}>
        <h3 style={titleStyle}>Admin Information</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#1976d2', color: 'white', borderRadius: '16px', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            Admin: {dashboardData.adminInfo?.name}
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#9c27b0', color: 'white', borderRadius: '16px', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
            Manages: Non-Technical Roles
          </span>
          <span style={{ fontSize: '14px', color: '#666', fontFamily: 'Arial, sans-serif' }}>
            Last Access: {new Date(dashboardData.adminInfo?.lastAccess).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;