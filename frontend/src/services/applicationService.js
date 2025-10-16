import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Application service
export const applicationService = {
  // Submit application
  submitApplication: async (applicationData) => {
    const response = await api.post(API_ENDPOINTS.APPLICATIONS.SUBMIT, applicationData);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
    return response.data;
  },

  // Get all applications (admin only)
  getAllApplications: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS.ALL, { params });
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id) => {
    const response = await api.get(API_ENDPOINTS.APPLICATIONS.BY_ID(id));
    return response.data;
  },

  // Update application status (admin/bot only)
  updateApplicationStatus: async (id, status) => {
    const response = await api.put(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), { status });
    return response.data;
  },

  // Add note to application (admin/bot only)
  addApplicationNote: async (id, note) => {
    const response = await api.post(API_ENDPOINTS.APPLICATIONS.ADD_NOTE(id), { note });
    return response.data;
  }
};

export default applicationService;
