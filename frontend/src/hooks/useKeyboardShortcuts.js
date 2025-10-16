import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if Ctrl/Cmd + key is pressed
      if (!(e.ctrlKey || e.metaKey)) return;

      switch (e.key) {
        case 'h': // Ctrl+H - Home
          e.preventDefault();
          navigate('/');
          break;
        case 'd': // Ctrl+D - Dashboard
          e.preventDefault();
          if (user) navigate('/dashboard');
          break;
        case 'j': // Ctrl+J - Jobs
          e.preventDefault();
          navigate('/jobs');
          break;
        case 'a': // Ctrl+A - Admin (if admin)
          e.preventDefault();
          if (user?.role === 'admin') navigate('/admin');
          break;
        case 'b': // Ctrl+B - Bot (if bot)
          e.preventDefault();
          if (user?.role === 'bot') navigate('/bot');
          break;
        case 'l': // Ctrl+L - Logout
          e.preventDefault();
          if (user) logout();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate, user, logout]);
};