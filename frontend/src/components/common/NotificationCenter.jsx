import { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Notifications, Circle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import socketService from '../../services/socketService';

const NotificationCenter = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token } = useAuth();
  const { info } = useToast();

  useEffect(() => {
    if (user && token) {
      socketService.connect(token);
      
      socketService.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
        info(notification.message);
      });

      socketService.on('applicationStatusUpdate', (data) => {
        const notification = {
          id: Date.now(),
          type: 'status_update',
          message: `Application status updated to ${data.status}`,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [notification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      socketService.off('notification');
      socketService.off('applicationStatusUpdate');
    };
  }, [user, token, info]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick} aria-label="notifications">
        <Badge badgeContent={unreadCount} color="error">
          <Notifications />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={() => markAsRead(notification.id)}
              sx={{ 
                whiteSpace: 'normal',
                alignItems: 'flex-start',
                opacity: notification.read ? 0.7 : 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                {!notification.read && (
                  <Circle sx={{ fontSize: 8, color: 'primary.main', mt: 1, mr: 1 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{notification.message}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;