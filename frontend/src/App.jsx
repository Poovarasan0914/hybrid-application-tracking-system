import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import config from './config/env';

// Import pages (to be created in Phase 2)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import AdminPage from './pages/AdminPage';
import BotPage from './pages/BotPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ApplicationTracker from './components/applications/ApplicationTracker';

const AppContent = () => {
  useKeyboardShortcuts();
  
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRole="applicant">
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id/timeline" 
          element={
            <ProtectedRoute>
              <ApplicationTracker />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Bot routes */}
        <Route 
          path="/bot/*" 
          element={
            <ProtectedRoute requiredRole="bot">
              <BotPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Error routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
