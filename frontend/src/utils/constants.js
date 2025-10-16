// Application constants
export const ROLES = {
  APPLICANT: 'applicant',
  ADMIN: 'admin',
  BOT: 'bot'
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
};

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship'
};

export const ROLE_CATEGORIES = {
  TECHNICAL: 'technical',
  NON_TECHNICAL: 'non-technical'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  JOBS: {
    ACTIVE: '/api/jobs/active',
    BY_ID: (id) => `/api/jobs/${id}`,
    CREATE: '/api/jobs',
    UPDATE: (id) => `/api/jobs/${id}`,
    DELETE: (id) => `/api/jobs/${id}`
  },
  APPLICATIONS: {
    SUBMIT: '/api/applications',
    MY_APPLICATIONS: '/api/applications/my-applications',
    ALL: '/api/applications/all',
    BY_ID: (id) => `/api/applications/${id}`,
    TIMELINE: (id) => `/api/applications/${id}/timeline`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
    ADD_NOTE: (id) => `/api/applications/${id}/notes`
  },
  ADMIN: {
    USERS: '/api/admin/users',
    TOGGLE_USER: (id) => `/api/admin/users/${id}/activate`,
    CREATE_BOT_USER: '/api/admin/users/bots'
  },
  AUDIT: {
    LOGS: '/api/audit'
  },
  BOT: {
    DASHBOARD: '/bot/dashboard'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  APPLICATIONS: '/applications',
  ADMIN: '/admin',
  BOT: '/bot',
  UNAUTHORIZED: '/unauthorized'
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  COVER_LETTER_MIN_LENGTH: 100
};

export default {
  ROLES,
  APPLICATION_STATUS,
  JOB_TYPES,
  ROLE_CATEGORIES,
  API_ENDPOINTS,
  ROUTES,
  VALIDATION_RULES
};
