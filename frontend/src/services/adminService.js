import api from './api';

export const adminService = {
  // Get admin dashboard data
  getAdminDashboard: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  // Get non-technical applications
  getNonTechnicalApplications: async (params = {}) => {
    const response = await api.get('/api/admin/applications/non-technical', { params });
    return response.data;
  },

  // Update application status with optional comment
  updateApplicationStatus: async (id, status, comment = '') => {
    const response = await api.put(`/api/admin/applications/${id}/status`, { status, comment });
    return response.data;
  },

  // Add note to application
  addApplicationNote: async (id, note) => {
    const response = await api.post(`/api/admin/applications/${id}/notes`, { note });
    return response.data;
  },

  // Create new job role
  createJobRole: async (jobData) => {
    const response = await api.post('/api/admin/jobs', jobData);
    return response.data;
  },

  // Get application progress tracking
  getApplicationProgress: async (id) => {
    const response = await api.get(`/api/admin/applications/${id}/progress`);
    return response.data;
  }
};

export default adminService;