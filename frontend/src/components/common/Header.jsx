import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
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
        <Box>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/jobs">Jobs</Button>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/jobs">Jobs</Button>
              {user?.role === 'applicant' && (
                <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
              )}
              {user?.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
              )}
              {user?.role === 'bot' && (
                <Button color="inherit" component={RouterLink} to="/bot">Bot</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


