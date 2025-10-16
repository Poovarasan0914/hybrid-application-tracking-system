import { Box, Paper, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const DataVisualization = ({ data, title = 'Data Visualization' }) => {
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('7d');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Mock data transformation based on time range
  const getTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      applications: Math.floor(Math.random() * 20) + 5,
      interviews: Math.floor(Math.random() * 10) + 2,
      offers: Math.floor(Math.random() * 5) + 1
    }));
  };

  const statusData = [
    { name: 'Pending', value: 45, color: '#FFBB28' },
    { name: 'Reviewing', value: 30, color: '#0088FE' },
    { name: 'Shortlisted', value: 15, color: '#00C49F' },
    { name: 'Rejected', value: 8, color: '#FF8042' },
    { name: 'Accepted', value: 12, color: '#8884D8' }
  ];

  const departmentData = [
    { department: 'Engineering', applications: 85, interviews: 25, offers: 12 },
    { department: 'Marketing', applications: 45, interviews: 15, offers: 8 },
    { department: 'Sales', applications: 60, interviews: 20, offers: 10 },
    { department: 'HR', applications: 25, interviews: 8, offers: 4 },
    { department: 'Finance', applications: 35, interviews: 12, offers: 6 }
  ];

  const performanceData = [
    { metric: 'Response Time', value: 85, fullMark: 100 },
    { metric: 'Application Quality', value: 75, fullMark: 100 },
    { metric: 'Interview Success', value: 90, fullMark: 100 },
    { metric: 'Offer Acceptance', value: 80, fullMark: 100 },
    { metric: 'Time to Hire', value: 70, fullMark: 100 }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTimeSeriesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="interviews" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="offers" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getTimeSeriesData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="interviews" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="offers" stackId="1" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#8884d8" />
              <Bar dataKey="interviews" fill="#82ca9d" />
              <Bar dataKey="offers" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="area">Area Chart</MenuItem>
                <MenuItem value="pie">Pie Chart</MenuItem>
                <MenuItem value="radar">Radar Chart</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {renderChart()}

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Interactive data visualization with multiple chart types and time ranges
        </Typography>
      </Paper>
    </Box>
  );
};

export default DataVisualization;