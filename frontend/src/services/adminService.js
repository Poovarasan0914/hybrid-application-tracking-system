import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Admin service
export const adminService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  // Toggle user activation (admin only)
  toggleUserActivation: async (id, isActive) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.TOGGLE_USER(id), { isActive });
    return response.data;
  },

  // Get audit logs (admin only)
  getAuditLogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT, { params });
    return response.data;
  }
};

export default adminService;
