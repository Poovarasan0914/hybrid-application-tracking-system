import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Brightness4, Brightness7, Keyboard } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import AccessibleButton from './AccessibleButton';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          ATS
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isAuthenticated ? (
            <>
              <AccessibleButton color="inherit" component={RouterLink} to="/jobs" ariaLabel="View available jobs">Jobs</AccessibleButton>
              <AccessibleButton color="inherit" component={RouterLink} to="/login" ariaLabel="Login to your account">Login</AccessibleButton>
              <AccessibleButton color="inherit" component={RouterLink} to="/register" ariaLabel="Create new account">Register</AccessibleButton>
            </>
          ) : (
            <>
              <AccessibleButton color="inherit" component={RouterLink} to="/jobs" ariaLabel="View available jobs">Jobs</AccessibleButton>
              {user?.role === 'applicant' && (
                <AccessibleButton color="inherit" component={RouterLink} to="/dashboard" ariaLabel="Go to dashboard">Dashboard</AccessibleButton>
              )}
              {user?.role === 'admin' && (
                <AccessibleButton color="inherit" component={RouterLink} to="/admin" ariaLabel="Admin panel">Admin</AccessibleButton>
              )}
              {user?.role === 'bot' && (
                <AccessibleButton color="inherit" component={RouterLink} to="/bot" ariaLabel="Bot dashboard">Bot</AccessibleButton>
              )}
              <AccessibleButton color="inherit" onClick={handleLogout} ariaLabel="Logout from account">Logout</AccessibleButton>
            </>
          )}
          
          <Tooltip title={showShortcuts ? 'Hide shortcuts' : 'Keyboard shortcuts: Ctrl+H (Home), Ctrl+D (Dashboard), Ctrl+J (Jobs), Ctrl+L (Logout)'}>
            <IconButton 
              color="inherit" 
              onClick={() => setShowShortcuts(!showShortcuts)}
              aria-label="Toggle keyboard shortcuts info"
            >
              <Keyboard />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


