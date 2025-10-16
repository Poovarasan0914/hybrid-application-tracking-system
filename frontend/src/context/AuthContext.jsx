import { createContext, useContext, useReducer, useEffect } from 'react';
import tokenManager, { setupSessionTimeout } from '../utils/tokenManager';
import { authService } from '../services/authService';

// Auth context for managing authentication state
const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();
    
    if (token && user && tokenManager.isTokenValid()) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
    } else {
      // Clear invalid data
      tokenManager.clearAuth();
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await authService.login(email, password);
      
      // Store token and user data
      // 24h default, 7d if rememberMe
      const expiryMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      tokenManager.setToken(data.token, expiryMs);
      tokenManager.setUser(data.user);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData, rememberMe = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await authService.register(userData);
      
      // Store token and user data
      const expiryMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      tokenManager.setToken(data.token, expiryMs);
      tokenManager.setUser(data.user);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token }
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    tokenManager.clearAuth();
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  // Setup session timeout when authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      const cleanup = setupSessionTimeout(() => logout(), 30);
      return () => cleanup();
    }
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
