import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Bot service
export const botService = {
  // Get bot dashboard data (bot only)
  getDashboard: async () => {
    const response = await api.get(API_ENDPOINTS.BOT.DASHBOARD);
    return response.data;
  }
};

export default botService;
