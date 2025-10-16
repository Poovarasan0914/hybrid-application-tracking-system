import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Bot service
export const botService = {
  // Get bot dashboard data (bot only)
  getDashboard: async () => {
    const response = await api.get(API_ENDPOINTS.BOT.DASHBOARD);
    return response.data;
  },

  // Auto-process technical applications
  autoProcessTechnical: async () => {
    const response = await api.post('/api/bot/auto-process-technical');
    return response.data;
  },

  // Process specific applications
  processApplications: async (applicationIds) => {
    const response = await api.post('/api/bot/process-applications', { applicationIds });
    return response.data;
  },

  // Get technical applications
  getTechnicalApplications: async (params = {}) => {
    const response = await api.get('/api/bot/technical-applications', { params });
    return response.data;
  }
};

export default botService;
