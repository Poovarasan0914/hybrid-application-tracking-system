import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const auditService = {
  // Get audit logs (admin only)
  getAuditLogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.LOGS, { params });
    return response.data;
  }
};

export default auditService;