// Token management utilities
const TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Token storage utilities
export const tokenManager = {
  // Store token with expiry
  setToken: (token, expiresIn = 24 * 60 * 60 * 1000) => { // Default 24 hours
    const expiryTime = Date.now() + expiresIn;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;
    return Date.now() > parseInt(expiryTime);
  },

  // Check if token is valid (exists and not expired)
  isTokenValid: () => {
    const token = tokenManager.getToken();
    return token && !tokenManager.isTokenExpired();
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Remove user data
  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clearAuth: () => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },

  // Get token expiry time remaining (in milliseconds)
  getTimeUntilExpiry: () => {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return 0;
    return Math.max(0, parseInt(expiryTime) - Date.now());
  },

  // Check if token needs refresh (within 5 minutes of expiry)
  needsRefresh: () => {
    const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return timeUntilExpiry > 0 && timeUntilExpiry < fiveMinutes;
  }
};

// Auto-refresh token logic
export const setupTokenRefresh = (refreshCallback) => {
  // Check token every minute
  const interval = setInterval(() => {
    if (tokenManager.needsRefresh()) {
      console.log('Token needs refresh');
      refreshCallback();
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
};

// Session timeout handler
export const setupSessionTimeout = (timeoutCallback, timeoutMinutes = 30) => {
  let timeoutId;
  
  const resetTimeout = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      console.log('Session timeout');
      timeoutCallback();
    }, timeoutMinutes * 60 * 1000);
  };

  // Reset timeout on user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true);
  });

  // Initial timeout
  resetTimeout();

  return () => {
    clearTimeout(timeoutId);
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout, true);
    });
  };
};

export default tokenManager;
