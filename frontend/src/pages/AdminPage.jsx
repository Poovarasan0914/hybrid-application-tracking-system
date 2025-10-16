import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import JobCreation from '../components/admin/JobCreation';
import ApplicationManagement from '../components/admin/ApplicationManagement';
import AuditLogs from '../components/admin/AuditLogs';

const AdminPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }} variant="scrollable" scrollButtons allowScrollButtonsMobile>
            <Tab label="Dashboard" />
            <Tab label="Applications" />
            <Tab label="Create Jobs" />
            <Tab label="Users" />
            <Tab label="Audit Logs" />
          </Tabs>

          {tab === 0 && <AdminDashboard />}
          {tab === 1 && <ApplicationManagement />}
          {tab === 2 && <JobCreation />}
          {tab === 3 && <UserManagement />}
          {tab === 4 && <AuditLogs />}
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPage;
