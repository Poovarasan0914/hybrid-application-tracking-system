import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Authentication service
export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  }
};

export default authService;
