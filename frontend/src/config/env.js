// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Application Tracking System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  NODE_ENV: import.meta.env.NODE_ENV || 'development'
};

export default config;
