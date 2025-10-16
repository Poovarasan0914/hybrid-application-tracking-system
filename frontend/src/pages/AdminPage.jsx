import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import UserManagement from '../components/admin/UserManagement';
import JobManagement from '../components/admin/JobManagement';
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
            <Tab label="Users" />
            <Tab label="Jobs" />
            <Tab label="Applications" />
            <Tab label="Audit Logs" />
          </Tabs>

          {tab === 0 && <UserManagement />}
          {tab === 1 && <JobManagement />}
          {tab === 2 && <ApplicationManagement />}
          {tab === 3 && <AuditLogs />}
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPage;
