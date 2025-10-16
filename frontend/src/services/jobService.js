import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Job service
export const jobService = {
  // Get active jobs with filters
  getActiveJobs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.JOBS.ACTIVE, { params });
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(API_ENDPOINTS.JOBS.BY_ID(id));
    return response.data;
  },

  // Create job (admin only)
  createJob: async (jobData) => {
    const response = await api.post(API_ENDPOINTS.JOBS.CREATE, jobData);
    return response.data;
  },

  // Update job (admin only)
  updateJob: async (id, jobData) => {
    const response = await api.put(API_ENDPOINTS.JOBS.UPDATE(id), jobData);
    return response.data;
  },

  // Delete job (admin only)
  deleteJob: async (id) => {
    const response = await api.delete(API_ENDPOINTS.JOBS.DELETE(id));
    return response.data;
  }
};

export default jobService;
