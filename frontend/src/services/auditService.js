import api from './api';

export const auditService = {
  // Get audit logs (admin only)
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/api/audit', { params });
    return response.data;
  }
};

export default auditService;